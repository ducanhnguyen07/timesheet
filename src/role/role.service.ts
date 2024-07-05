import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { ResponseRoleDto } from './dto/response/response-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponsePermissionDto } from '../permission/dto/response/response-permission.dto';
import { Permission } from '../permission/entities/permission.entity';
import { UserLoginDto } from '../auth/dto/auth-login.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

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
  ): Promise<ResponsePermissionDto[] | string> => {
    try {
      const permissionList = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .where('role.id = :id', { id })
        .getMany()
        .then((roles) => roles.map((role) => role.permissions));

      const responseList = permissionList.flat().map((item) =>
        plainToInstance(ResponsePermissionDto, item, {
          excludeExtraneousValues: true,
        }),
      );

      return responseList;
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
}
