import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsCheckedInToUserTable1723001766140 implements MigrationInterface {
    name = 'AddColumnIsCheckedInToUserTable1723001766140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isCheckedIn" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "checkInDate" SET DEFAULT '"2024-08-07T03:36:11.700Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "checkInDate" SET DEFAULT '2024-08-06 08:09:05.959'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isCheckedIn"`);
    }

}
