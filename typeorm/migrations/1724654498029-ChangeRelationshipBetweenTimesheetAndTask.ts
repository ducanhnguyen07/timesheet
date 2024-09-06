import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRelationshipBetweenTimesheetAndTask1724654498029 implements MigrationInterface {
    name = 'ChangeRelationshipBetweenTimesheetAndTask1724654498029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_a147ecd5c870c35058f8437b425"`);
        await queryRunner.query(`ALTER TABLE "timesheet" ALTER COLUMN "taskId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "checkInDate" SET DEFAULT '"2024-08-26T06:41:44.440Z"'`);
        await queryRunner.query(`ALTER TABLE "timesheet" ADD CONSTRAINT "FK_a147ecd5c870c35058f8437b425" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_a147ecd5c870c35058f8437b425"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "checkInDate" SET DEFAULT '2024-08-09 01:59:32.521'`);
        await queryRunner.query(`ALTER TABLE "timesheet" ALTER COLUMN "taskId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet" ADD CONSTRAINT "FK_a147ecd5c870c35058f8437b425" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
