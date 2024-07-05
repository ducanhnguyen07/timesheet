import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import RoleSeeder from './role.seed';
import { RoleFactory } from '../../typeorm/factories/role.factory';
import PermissionSeeder from './permission.seed';
import { PermissionFactory } from '../../typeorm/factories/permission.factory';
import RolePermissionSeeder from './role-permission.seed';
import UserSeeder from './user.seed';
import { UserFactory } from '../../typeorm/factories/user.factory';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, RoleSeeder, PermissionSeeder, RolePermissionSeeder],
      factories: [UserFactory, RoleFactory, PermissionFactory],
    });
  }
}