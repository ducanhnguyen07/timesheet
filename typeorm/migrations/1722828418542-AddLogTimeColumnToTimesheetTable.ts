import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogTimeColumnToTimesheetTable1722828418542 implements MigrationInterface {
    name = 'AddLogTimeColumnToTimesheetTable1722828418542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet" ADD "logTime" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "logTime"`);
    }

}
