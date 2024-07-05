import { Module, forwardRef } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => RoleModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService, TypeOrmModule.forFeature([Permission])],
})
export class PermissionModule {}
