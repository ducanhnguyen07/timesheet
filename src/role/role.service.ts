import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { ResponseRoleDto } from './dto/response/response-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponsePermissionDto } from '../permission/dto/response/response-permission.dto';
import { Permission } from '../permission/entities/permission.entity';
import { IRolePermission } from '../../src/common/interface/role-permission.interface';
import { IUpdateRole } from '../../src/common/interface/update-role.interface';
import { User } from '../../src/user/entities/user.entity';
import { ResponseUserDto } from '../../src/user/dto/response/response-user-dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<ResponseRoleDto | string> {
    try {
      const createdRole = await this.roleRepository.save(createRoleDto);

      const responseRole = plainToInstance(ResponseRoleDto, createdRole, {
        excludeExtraneousValues: true,
      });
      return responseRole;
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  }

  getPermissionByRoleId = async (
    id: string,
  ): Promise<IRolePermission | string> => {
    try {
      const permissionList = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .where('role.id = :id', { id })
        .getMany()
        .then((roles) => roles.map((role) => role.permissions));

      const permissionResponseList = permissionList.flat().map((item) =>
        plainToInstance(ResponsePermissionDto, item, {
          excludeExtraneousValues: true,
        }),
      );

      const role = await this.roleRepository.findOne({
        where: {
          id: id,
        },
      });

      const responseRole = plainToInstance(ResponseRoleDto, role, {
        excludeExtraneousValues: true,
      });

      return {
        role: responseRole,
        permissions: permissionResponseList,
      };
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  };

  findRoleByUser = async (id: string) => {
    try {
      const role = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.users', 'user')
        .where('user.id = :id', { id })
        .getOne();

      return role;
    } catch (error) {
      return 'Failed!';
    }
  };

  getAllRole = async () => {
    try {
      const roleList = await this.roleRepository.find({});
      const responseList = roleList.map((item) =>
        plainToInstance(ResponseRoleDto, item, {
          excludeExtraneousValues: true,
        }),
      );
      return responseList;
    } catch (error) {
      throw BadRequestException;
    }
  };

  updateRoleList = async (updateRoleList: IUpdateRole[]) => {
    try {
      const responseList = [];
      for (const item of updateRoleList) {
        const user = await this.userRepository.findOne({
          where: { id: item.userId },
          relations: ['roles'],
        });

        if (!user) {
          throw new Error(`User with id ${item.userId} not found`);
        }

        const role = await this.roleRepository.findOne({
          where: { id: item.role },
        });

        if (!role) {
          throw new Error(`Role with enum ${item.role} not found`);
        }

        user.roles = [role];
        const updatedUser = await this.userRepository.save(user);

        responseList.push({
          user: plainToInstance(ResponseUserDto, updatedUser, {
            excludeExtraneousValues: true,
          }),
          newRole: plainToInstance(ResponseRoleDto, updatedUser.roles[0], {
            excludeExtraneousValues: true
          }),
        });
      }

      return responseList;
    } catch (error) {
      console.log(error);
    }
  };

  getRoleUser = async () => {
    try {
      const userList = await this.userRepository.find({
        relations: ['roles'],
      });

      const responseUserList = userList.map(user => {
        return {
          user: plainToInstance(ResponseUserDto, user, {
            excludeExtraneousValues: true,
          }),
          role: plainToInstance(ResponseRoleDto, user.roles, {
            excludeExtraneousValues: true,
          })[0],
        };
      });

      return responseUserList;
    } catch (error) {
      console.log(error);
    }
  };
}
