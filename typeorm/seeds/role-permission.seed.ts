import { Role } from "../../src/role/entities/role.entity";
import { DataSource } from "typeorm";
import { SeederFactoryManager } from "typeorm-extension";
import { Permission } from "../../src/permission/entities/permission.entity";
import RolePermission from "../../src/common/constant/role-permission.constant";

export default class RolePermissionSeeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
    const roleRepository = dataSource.getRepository(Role);
    const permissionRepository = dataSource.getRepository(Permission);

    for (const roleMap in RolePermission) {
      const role = await roleRepository.findOne({
        where: {
          roleEnum: parseInt(roleMap),
        },
      });

      const permissionList = RolePermission[roleMap];
      const newList = [];
      for (const name of permissionList) {
        const permission = await permissionRepository.findOne({
          where: { name: name }
        });
        
        newList.push(permission);
        role.permissions = newList;
      }

      await roleRepository.save(role);
    }
  }
}