import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/response/response-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task/entities/task.entity';
import { Project } from '../project/entities/project.entity';
import { ResponseTaskDto } from '../task/dto/response/response-task-dto';
import { PaginationHelper } from '../helper/pagination.helper';
import { Role } from '../role/entities/role.entity';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { USER_PASSWORD_DEFAULT } from '../common/constant/upload-file.constant';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../../src/configs/cloudinary.response';
import RolePermission from '../../src/common/constant/role-permission.constant';
import { DiscordService } from '../../src/discord/discord.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Timesheet } from '../../src/timesheet/entities/timesheet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Task>,
    @InjectRepository(Timesheet)
    private readonly timesheetRepository: Repository<Timesheet>,

    private readonly paginationHelper: PaginationHelper,

    private discordService: DiscordService,
  ) {}

  private readonly logger = new Logger(UserService.name);
  private readonly adminSeedEmail: string = process.env.ADMIN_SEED_EMAIL;

  async create(createUserDto: CreateUserDto) {
    try {
      const emailExist = createUserDto.email;
      const existedUser = await this.userRepository.findOne({
        where: {
          email: emailExist,
        } as FindOptionsWhere<User>,
      });

      if (existedUser) {
        throw new ConflictException('User already exists');
      } else {
        const { role, ...userData } = createUserDto;

        const roles = await this.roleRepository.find({
          where: {
            roleEnum: role,
          } as FindOptionsWhere<Role>,
        });

        const hashedPassword = this.getHashPassword(userData.password);

        const user = this.userRepository.create({
          ...userData,
          password: hashedPassword,
          roles,
        });

        const createdUser = await this.userRepository.save(user);

        const responseUser = plainToInstance(ResponseUserDto, createdUser, {
          excludeExtraneousValues: true,
        });
        return responseUser;
      }
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }

  async findAll(pagination?: { limit?: number; page?: number }) {
    try {
      const objPagination = this.paginationHelper.getPagination(pagination);

      const amountUser = await this.userRepository.count();

      const listUser = await this.userRepository.find({
        skip: (objPagination.currentPage - 1) * objPagination.limitItem,
        take: objPagination.limitItem,
      });

      const responseListUser = listUser.map((user) =>
        plainToInstance(ResponseUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      return { responseListUser, amountUser };
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      const userList = await this.userRepository.find({});

      const responseUserList = userList.map((user) =>
        plainToInstance(ResponseUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      return responseUserList;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string): Promise<ResponseUserDto | string> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      return plainToInstance(ResponseUserDto, user, {
        excludeExtraneousValues: true, // @Expose()
      });
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<string | ResponseUserDto> {
    try {
      const updateUser = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      if (updateUserDto.password) {
        updateUserDto.password = this.getHashPassword(updateUserDto.password);
      }

      Object.assign(updateUser, updateUserDto);
      const updatedUser = await this.userRepository.save(updateUser);
      const responseUser = plainToInstance(ResponseUserDto, updatedUser, {
        excludeExtraneousValues: true,
      });

      return responseUser;
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  }

  async deleteOne(id: string): Promise<ResponseUserDto | string> {
    try {
      const deleteUser = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      deleteUser.isDeleted = true;
      deleteUser.deletedAt = new Date();

      this.userRepository.save(deleteUser);

      const responseUser = plainToInstance(ResponseUserDto, deleteUser, {
        excludeExtraneousValues: true,
      });
      return responseUser;
    } catch (error) {
      console.log(error);
      return 'Delete failed!';
    }
  }

  getOwnPermission = async (user: any) => {
    const userPermission: number = user.roles;

    return RolePermission[userPermission];
  };

  findTask = async (id: string): Promise<ResponseTaskDto[] | string> => {
    try {
      const taskList = await this.taskRepository
        .createQueryBuilder('task')
        .where(`task.userId = :id`, { id })
        .getMany();

      const responseTaskList = taskList.map((task) =>
        plainToInstance(ResponseTaskDto, task, {
          excludeExtraneousValues: true,
        }),
      );

      return responseTaskList;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  };

  findProject = async (id: string) => {
    try {
      const projects = await this.projectRepository
        .createQueryBuilder('project')
        .innerJoin('project.tasks', 'task')
        .where(`task.userId = "userId"`, { id })
        .getMany();

      return projects;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  };

  getWorkingTime = async (id: string): Promise<number | string> => {
    try {
      const timesheets = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.tasks', 'task')
        .innerJoinAndSelect('task.timesheets', 'timesheet')
        .where('user.id = :id', { id })
        .getMany()
        .then((tasks) =>
          tasks.flatMap((task) =>
            task.tasks.flatMap((task) => task.timesheets),
          ),
        );

      const workingTime = timesheets.reduce((acc, curTimesheet) => {
        if (curTimesheet.status == 1) {
          return acc + curTimesheet.workingTime;
        }
      }, 0);

      return workingTime;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  };

  getOwnWorkingTime = async (user: any): Promise<number> => {
    try {
      const userId: string = user.id;
      const currUser = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.tasks', 'task')
        .where('user.id = :userId', { userId })
        .getOne()
      
      const taskList = currUser['tasks'].map(task => task.id);
      const timesheetList = [];
      for (const taskId of taskList) {
        const timesheet = await this.timesheetRepository.find({
          where: { taskId: taskId }
        });
        timesheet.forEach(ts => timesheetList.push(ts));
      }

      let workingTime: number = 0;
      for (const timesheet of timesheetList) {
        if (timesheet.status == 1) {
          workingTime += timesheet.workingTime;
        }
      }

      return workingTime;
    } catch (error) {
      console.log(error);
    }
  };

  uploadAvatar(user: any, file: Express.Multer.File) {
    if (!file || !file.path) {
      throw new Error('File is undefined or empty');
    }

    const uploadImagePromise = new Promise<CloudinaryResponse>(
      (resolve, reject) => {
        cloudinary.uploader.upload(file.path, async (error, result) => {
          if (error) return reject(error);

          user.avatar = result.secure_url;
          try {
            await this.userRepository.save(user);
            resolve(result);
          } catch (saveError) {
            console.error(saveError);
            reject(saveError);
          }
        });
      },
    );

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  getInfo = async (user: any): Promise<ResponseUserDto | string> => {
    try {
      const reqUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      return plainToInstance(ResponseUserDto, reqUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  };

  exportExcelFile = async () => {
    try {
      const users = await this.userRepository.find({});
      const responseListUser = users.map((user) =>
        plainToInstance(ResponseUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      const rows: Array<Array<string>> = [];

      responseListUser.forEach((user) => {
        rows.push(Object.values(user));
      });

      const book: Workbook = new Workbook();
      const sheet = book.addWorksheet('sheet1');
      rows.unshift(Object.keys(responseListUser[0]));
      sheet.addRows(rows);

      const File = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: 'MyExcelSheet',
            postfix: '.xlsx',
            mode: parseInt('0600', 8),
          },
          async (err, file) => {
            if (err) {
              throw new BadRequestException(err);
            }
            book.xlsx
              .writeFile(file)
              .then((_) => {
                resolve(file);
              })
              .catch((err) => {
                throw new BadRequestException(err);
              });
          },
        );
      });

      return File;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  };

  importExcelFile = async (file: Express.Multer.File) => {
    try {
      const filePath = file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const responseUsers: ResponseUserDto[] = [];

      for (const [index, row] of jsonData.entries()) {
        if (index === 0) continue;

        const user = new User();
        user.name = row[0]?.toString() || '';
        user.email = row[1]?.toString() || '';
        user.address = row[2]?.toString() || '';
        user.gender = row[3]?.toString() || '';
        user.branch = parseInt(row[4]) || 0;

        user.password = this.getHashPassword(USER_PASSWORD_DEFAULT);

        const createdUser = await this.userRepository.save(user);

        responseUsers.push(
          plainToInstance(ResponseUserDto, createdUser, {
            excludeExtraneousValues: true,
          }),
        );
      }
      fs.unlinkSync(filePath);

      return responseUsers;
    } catch (error) {
      console.error(error);
      return 'Failed!';
    }
  };

  findUserByToken = async (refreshToken: string): Promise<User | undefined> => {
    const userByToken = await this.userRepository.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    return userByToken;
  };

  handleCheckIn = async (user: any, checkInToken: string) => {
    try {
      const userId: string = user.id;
      const checkInUser = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (checkInToken === checkInUser.checkInToken) {
        const date = new Date();
        const newCheckIn = this.formatCITime(date);

        if(!checkInUser.isCheckedIn) {
          checkInUser.checkIn = newCheckIn;
          checkInUser.isCheckedIn = true;
        } else {
          checkInUser.checkOut = newCheckIn;
        }
        const responseUser = await this.userRepository.save(checkInUser);
        
        const message = `Successfully check in ${newCheckIn}`;
        this.discordService.sendDirectMessage(message);
        return {
          user: plainToInstance(ResponseUserDto, responseUser, {
            excludeExtraneousValues: true,
          }),
          status: true,
        };
      } else {
        return {
          user: plainToInstance(ResponseUserDto, checkInUser, {
            excludeExtraneousValues: true,
          }),
          status: false,
        };
      }      
    } catch (error) {
      console.log(error);
    }
  };

  @Cron(CronExpression.EVERY_DAY_AT_7AM, { name: 'send mail to user' })
  async handleResetCheckIn() {
    try {
      const user = await this.userRepository.findOne({
        where: { email: this.adminSeedEmail }
      });

      const lateTime = this.getSubTime(user.checkIn, user.stWork);
      const earlyTime = this.getSubTime(user.fiWork, user.checkOut);
      const checkInDate = this.formatCIDate(user.checkInDate);

      // reset ci/co user info
      user.checkIn = user.stWork;
      user.checkOut = user.stWork;
      user.isCheckedIn = false;
      user.checkInDate = new Date();

      await this.userRepository.save(user);

      const message: string = `In ${checkInDate}, you check in late ${lateTime} and check out early ${earlyTime}`;
      this.discordService.sendDirectMessage(message);
    } catch (error) {
      console.log(error);
    }
  }

  getHashPassword = (plain: string): string => {
    const salt = genSaltSync(10);
    const hash = hashSync(plain, salt);
    return hash;
  };

  isValidPassword = (plain: string, hash: string): boolean => {
    return compareSync(plain, hash);
  };

  formatCITime = (date: Date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  formatCIDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  getSubTime = (date1: string, date2: string): number => {
    const arr1: number[] = date1.split(':').map((i) => parseInt(i));
    const arr2: number[] = date2.split(':').map((i) => parseInt(i));

    return (arr1[0] - arr2[0]) * 60 + (arr1[1] - arr2[1]);
  };
}
