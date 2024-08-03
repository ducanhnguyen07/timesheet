import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { UpdatePermissionDto } from './dto/request/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';
import { ResponsePermissionDto } from './dto/response/response-permission.dto';
import { Role } from '../role/entities/role.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<ResponsePermissionDto | string> {
    try {
      const { name, roleIds } = createPermissionDto;

      const existedPermission = await this.permissionRepository.findOne({
        where: {
          name: name
        }
      });
      if(existedPermission) {
        return 'Permission existed';
      }

      const roles = await this.roleRepository.find({
        where: {
          id: In(roleIds),
        },
      });
  
      const permission = this.permissionRepository.create({ name, roles });
  
      const newPermission = await this.permissionRepository.save(permission);
      const responsePermission = plainToInstance(ResponsePermissionDto, newPermission, {
        excludeExtraneousValues: true
      });
      return responsePermission;
    } catch (error) {
      console.log(error);
      return 'Failed!';
    }
  }
}
