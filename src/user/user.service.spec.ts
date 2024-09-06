// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { Task } from '../task/entities/task.entity';
// import { Timesheet } from '../timesheet/entities/timesheet.entity';
// import { UserService } from './user.service';
// import { Cache } from 'cache-manager';
// import { BranchConstant } from '../common/constant/branch.constant';
// import { StatusConstant } from '../../src/common/constant/status.constant';
// import { Project } from '../project/entities/project.entity';
// import { Role } from '../role/entities/role.entity';
// import { PaginationHelper } from '../helper/pagination.helper';
// import { ResponseUserDto } from './dto/response/response-user-dto';
// import { plainToInstance } from 'class-transformer';

import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "../../src/task/entities/task.entity";
import { Project } from "../../src/project/entities/project.entity";
import { Role } from "../../src/role/entities/role.entity";
import { Timesheet } from "../../src/timesheet/entities/timesheet.entity";
import { PaginationHelper } from "../../src/helper/pagination.helper";
import { DiscordService } from "../../src/discord/discord.service";
import { LoggerService } from "../../src/logging/log.service";
import { Client } from 'pg';
import request from 'supertest';


// const mockUser: User = {
//   id: '1',
//   name: 'John Doe',
//   email: 'john.doe@example.com',
//   address: '123 Main Street',
//   gender: 'Male',
//   branch: BranchConstant.HANOI1,
//   avatar: 'https://example.com/avatar.jpg',
//   isDeleted: false,
//   password: 'password',
//   tasks: null,
//   roles: null,
//   requests: null,
//   createdAt: null,
//   updatedAt: null,
//   deletedAt: null,
//   createdUser: null,
//   stWork: '',
//   fiWork: '',
//   checkIn: '',
//   checkOut: '',
//   checkInDate: undefined,
//   refreshToken: '',
//   checkInToken: '',
//   isCheckedIn: false
// };

// const mockTimesheet: Timesheet[] = [
//   {
//     id: '1',
//     workingTime: 8,
//     note: 'Note',
//     taskId: '1',
//     status: StatusConstant.APPROVE,
//     createdAt: null,
//     updatedAt: null,
//     deletedAt: null,
//     isDeleted: false,
//     logTime: undefined
//   },
//   {
//     id: '2',
//     workingTime: 8,
//     note: 'Note 2',
//     taskId: '1',
//     status: StatusConstant.APPROVE,
//     createdAt: null,
//     updatedAt: null,
//     deletedAt: null,
//     isDeleted: false,
//     logTime: undefined
//   },
// ];

// const mockTask: Task = {
//   id: '1',
//   name: 'Task 1',
//   description: 'Description',
//   status: 1,
//   projectId: null,
//   userId: mockUser,
//   timesheets: mockTimesheet,
//   createdAt: null,
//   updatedAt: null,
//   deletedAt: null,
//   isDeleted: false,
//   requirement: null,
// };

// const mockWorkingTime = mockTimesheet.reduce((acc, cur) => {
//   return acc + cur.workingTime;
// }, 0);

// describe('UserService', () => {
//   let service: UserService;
//   let userRepository: Repository<User>;
//   let taskRepository: Repository<Task>;
//   let projectRepository: Repository<Project>;
//   let roleRepository: Repository<Role>;

const mockPaginationHelper = {
  getPagination: jest.fn().mockImplementation((pagination) => {
    let limitItem = 2;
    let currentPage = 1;

    if (pagination?.limit) {
      limitItem = pagination.limit;
    }
    if (pagination?.page) {
      currentPage = pagination.page;
    }

    return {
      limitItem,
      currentPage,
    };
  }),
};

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getRepositoryToken(User),
//           useClass: Repository,
//         },
//         {
//           provide: getRepositoryToken(Task),
//           useClass: Repository,
//         },
//         {
//           provide: getRepositoryToken(Project),
//           useClass: Repository,
//         },
//         {
//           provide: getRepositoryToken(Role),
//           useClass: Repository,
//         },
//         {
//           provide: PaginationHelper,
//           useValue: mockPaginationHelper,
//         },
//         {
//           provide: CACHE_MANAGER,
//           useValue: {
//             get: jest.fn(),
//             set: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     userRepository = module.get<Repository<User>>(getRepositoryToken(User));
//     cacheService = module.get<Cache>(CACHE_MANAGER);
//   });

//   describe('findAll', () => {
//     it('should return an array of ResponseUserDto with pagination', async () => {
//       const pagination = { limit: 2, page: 2 };

//       const mockUsers = [mockUser, mockUser, mockUser];

//       const expectedUsers = mockUsers
//         .slice(2, 4)
//         .map((user) =>
//           plainToInstance(ResponseUserDto, user, {
//             excludeExtraneousValues: true,
//           }),
//         );

//       jest
//         .spyOn(userRepository, 'find')
//         .mockResolvedValue(mockUsers.slice(2, 4));

//       const result = await service.findAll(pagination);

//       expect(userRepository.find).toHaveBeenCalledWith({
//         skip: (pagination.page - 1) * pagination.limit,
//         take: pagination.limit,
//       });

//       expect(result).toEqual(expectedUsers);
//     });

//     it('should return an empty array if no users found', async () => {
//       jest.spyOn(userRepository, 'find').mockResolvedValue([]);
//       const result = await service.findAll();
//       expect(result).toEqual([]);
//     });
//   });

//   describe('getWorkingTime', () => {
//     // test the cacheService.get() function be called
//     it('should return working time from cache', async () => {
//       jest.spyOn(cacheService, 'get').mockResolvedValue(mockWorkingTime);

//       const workingTime = await service.getWorkingTime(mockUser.id);

//       expect(cacheService.get).toHaveBeenCalledWith('workingTime');
//       expect(workingTime).toBe(mockWorkingTime);
//     });

//     it('should calculate and cache working time', async () => {
//       mockUser.tasks = [mockTask];

//       jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
//         innerJoinAndSelect: jest.fn().mockReturnThis(),
//         where: jest.fn().mockReturnThis(),
//         getMany: jest.fn().mockResolvedValue([mockUser]),
//       } as any);

//       const workingTime = await service.getWorkingTime(mockUser.id);

//       expect(userRepository.createQueryBuilder).toHaveBeenCalled();
//       expect(cacheService.set).toHaveBeenCalledWith(
//         'workingTime',
//         mockWorkingTime,
//       );
//       expect(workingTime).toBe(mockWorkingTime);
//     });

//     it('should handle errors', async () => {
//       jest
//         .spyOn(userRepository, 'createQueryBuilder')
//         .mockImplementation(() => {
//           throw new Error('Database error');
//         });

//       const result = await service.getWorkingTime(mockUser.id);

//       expect(result).toBe('Failed!');
//     });
//   });
// });

const testDbOps = {
  host: 'localhost',
  port: 5432,
  user: 'test',
  password: '1234',
  database: 'test',
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let client: Client;

  beforeAll(async () => {
    client = new Client({
      host: testDbOps.host,
      port: testDbOps.port,
      user: testDbOps.user,
      password: testDbOps.password,
      database: testDbOps.database,
    });
  });


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Timesheet),
          useClass: Repository,
        },
        {
          provide: PaginationHelper,
          useValue: mockPaginationHelper,
        },
        LoggerService,
        DiscordService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('Test Server and Database Connection', () => {
    test('should return 200', async () => {
      const response = await request('http://localhost:3000')
        .get('/v1/users/test-server/host')
        .expect(200);

      expect(response.status).toBe(200);
    });

    test('should return true', async() => {
      try {
        await client.connect();
        const result = await client.query('SELECT $1::text as message', ['Test Database']);
        expect(result.rows[0].message).toBe('Test Database');
      } catch (error) {
        fail('Failed to connect to PostgreSQL');
      } finally {
        await client.end();
      }
    });
  });

  describe('Test API', () => {
    test('should return right number', async () => {
      const expectResult: number = 16;
      const mockUser = { id: '2b01442f-eec8-4f3c-bc88-4e77c7baee7f' };
      const mockToken = 
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcm9tIHNlcnZlciIsImlzcyI6InRva2VuIGxvZ2luIiwiaWQiOiIyYjAxNDQyZi1lZWM4LTRmM2MtYmM4OC00ZTc3YzdiYWVlN2YiLCJlbWFpbCI6ImFkbWluLnNlZWRAZ21haWwuY29tIiwicm9sZXMiOjIsImlzQWN0aXZlIjp0cnVlLCJpYXQiOjE3MjU0Mzc3MDMsImV4cCI6MTcyNTUyNDEwM30.6JdV88RfHEFxNzR6qUjYi1c9u_RrOXavV_-Uw40DiyI`;
      const response = await request('http://localhost:3000')
        .get('/v1/users/working-time/my-working-time/get-time')
        .set('Authorization', `Bearer ${mockToken}`) 
        .send(mockUser);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(expectResult);
    });
  });
});
