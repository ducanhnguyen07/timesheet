import { Timesheet } from "../../src/timesheet/entities/timesheet.entity";
import { Request } from "../../src/request/entities/request.entity";
import { Task } from "../../src/task/entities/task.entity";
import { User } from "../../src/user/entities/user.entity";
import { Project } from "../../src/project/entities/project.entity";
import { Role } from "../../src/role/entities/role.entity";
import { DataSource } from "typeorm";

export default class DeleteSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource
      .createQueryBuilder()
      .delete()
      .from('user')
      .execute();
  }
}