import { RoleConstant } from '../../src/common/constant/role.constant';
import { Role } from '../../src/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);
    const roleFactory = await factoryManager.get(Role);

    const roles = Object.values(RoleConstant)
      .filter((value) => typeof value === 'number')
      .map(async (roleEnumValue) => {
        const role = await roleFactory.make();
        role.roleEnum = roleEnumValue as RoleConstant;

        switch (roleEnumValue) {
          case RoleConstant.USER:
            role.name = 'User';
            break;
          case RoleConstant.MANAGER:
            role.name = 'Manager';
            break;
          case RoleConstant.ADMIN:
            role.name = 'Admin';
            break;
          default:
            role.name = '';
            break;
        }
        return role;
      });

    for (const role of roles) {
      await repository.save(await role);
    }
  }
}
