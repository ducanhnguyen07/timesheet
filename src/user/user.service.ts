import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
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
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { USER_PASSWORD_DEFAULT } from 'src/common/constant/upload-file.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Task>,

    @Inject(CACHE_MANAGER) private cacheService: Cache,

    private readonly paginationHelper: PaginationHelper,
  ) {}

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

      const listUser = await this.userRepository.find({
        skip: (objPagination.currentPage - 1) * objPagination.limitItem,
        take: objPagination.limitItem,
      });

      const responseListUser = listUser.map((user) =>
        plainToInstance(ResponseUserDto, user, {
          excludeExtraneousValues: true,
        }),
      );

      return responseListUser;
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
      const cacheKey = `workingTime`;
      const cachedTime = await this.cacheService.get<number>(cacheKey);

      if (cachedTime !== undefined && cachedTime !== null) {
        console.log('Returning cached working time!');
        return cachedTime;
      }

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

      await this.cacheService.set(cacheKey, workingTime);

      return workingTime;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  };

  uploadAvatar = async (id: string, file: Express.Multer.File) => {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });

      user.avatar = `public/${file.filename}`;
      const responseUser = await this.userRepository.save(user);

      return plainToInstance(ResponseUserDto, responseUser, {
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

        responseUsers.push(plainToInstance(ResponseUserDto, createdUser, {
          excludeExtraneousValues: true
        }));
      }
      fs.unlinkSync(filePath);

      return responseUsers;
    } catch (error) {
      console.error(error);
      return 'Failed!';
    }
  };

  getHashPassword = (plain: string): string => {
    const salt = genSaltSync(10);
    const hash = hashSync(plain, salt);
    return hash;
  };

  isValidPassword = (plain: string, hash: string): boolean => {
    return compareSync(plain, hash);
  };
}
