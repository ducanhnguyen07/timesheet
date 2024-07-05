import { Timesheet } from "../../src/timesheet/entities/timesheet.entity";
import { Request } from "../../src/request/entities/request.entity";
import { Task } from "../../src/task/entities/task.entity";
import { User } from "../../src/user/entities/user.entity";
import { Connection, DataSource } from "typeorm";
import { Project } from "../../src/project/entities/project.entity";
import { Role } from "../../src/role/entities/role.entity";

export default class DeleteSeeder {
  public async run(connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .delete()
      .from('user')
      .execute();
  }
}