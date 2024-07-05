import PermissionConstant from "../../src/common/constant/permission.constant";
import { Permission } from '../../src/permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { SeederFactoryManager } from 'typeorm-extension';

export default class PermissionSeeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const permissionRepository = dataSource.getRepository(Permission);
    const roleFactory = factoryManager.get(Permission);

    const permissions = PermissionConstant.map(async (permissionConst) => {
      const permission = await roleFactory.make();
      permission.name = permissionConst;

      return permission;
    });

    for (const permission of permissions) {
      await permissionRepository.save(await permission);
    }
  }
}
