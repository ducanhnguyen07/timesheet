import { DataSource } from "typeorm";

export default class DeleteSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource
      .createQueryBuilder()
      .delete()
      .from('timesheet')
      .execute();
  }
}