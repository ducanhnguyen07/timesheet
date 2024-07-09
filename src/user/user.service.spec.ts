import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { Timesheet } from '../timesheet/entities/timesheet.entity';
import { UserService } from './user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BranchConstant } from '../common/constant/branch.constant';
import { TimesheetStatusConstant } from '../common/constant/timesheet.constant';
import { Project } from '../project/entities/project.entity';
import { Role } from '../role/entities/role.entity';
import { PaginationHelper } from '../helper/pagination.helper';
import { ResponseUserDto } from './dto/response/response-user-dto';
import { plainToInstance } from 'class-transformer';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  address: '123 Main Street',
  gender: 'Male',
  branch: BranchConstant.HANOI1,
  avatar: 'https://example.com/avatar.jpg',
  isDeleted: false,
  password: 'password',
  tasks: null,
  roles: null,
  requests: null,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  createdUser: null,
};

const mockTimesheet: Timesheet[] = [
  {
    id: '1',
    workingTime: 8,
    note: 'Note',
    taskId: '1',
    status: TimesheetStatusConstant.APPROVE,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
    isDeleted: false,
  },
  {
    id: '2',
    workingTime: 8,
    note: 'Note 2',
    taskId: '1',
    status: TimesheetStatusConstant.APPROVE,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
    isDeleted: false,
  },
];

const mockTask: Task = {
  id: '1',
  name: 'Task 1',
  description: 'Description',
  status: 1,
  projectId: null,
  userId: mockUser,
  timesheets: mockTimesheet,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  isDeleted: false,
  requirement: null,
};

const mockWorkingTime = mockTimesheet.reduce((acc, cur) => {
  return acc + cur.workingTime;
}, 0);

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let taskRepository: Repository<Task>;
  let projectRepository: Repository<Project>;
  let roleRepository: Repository<Role>;
  let cacheService: Cache;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: PaginationHelper,
          useValue: mockPaginationHelper,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  describe('findAll', () => {
    it('should return an array of ResponseUserDto with pagination', async () => {
      const pagination = { limit: 2, page: 2 };

      const mockUsers = [mockUser, mockUser, mockUser];

      const expectedUsers = mockUsers
        .slice(2, 4)
        .map((user) =>
          plainToInstance(ResponseUserDto, user, {
            excludeExtraneousValues: true,
          }),
        );

      jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(mockUsers.slice(2, 4));

      const result = await service.findAll(pagination);

      expect(userRepository.find).toHaveBeenCalledWith({
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      });

      expect(result).toEqual(expectedUsers);
    });

    it('should return an empty array if no users found', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('getWorkingTime', () => {
    // test the cacheService.get() function be called
    it('should return working time from cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(mockWorkingTime);

      const workingTime = await service.getWorkingTime(mockUser.id);

      expect(cacheService.get).toHaveBeenCalledWith('workingTime');
      expect(workingTime).toBe(mockWorkingTime);
    });

    it('should calculate and cache working time', async () => {
      mockUser.tasks = [mockTask];

      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
      } as any);

      const workingTime = await service.getWorkingTime(mockUser.id);

      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith(
        'workingTime',
        mockWorkingTime,
      );
      expect(workingTime).toBe(mockWorkingTime);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          throw new Error('Database error');
        });

      const result = await service.getWorkingTime(mockUser.id);

      expect(result).toBe('Failed!');
    });
  });
});
