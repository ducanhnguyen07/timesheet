import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnCheckInDateToUserTable1722929265172 implements MigrationInterface {
    name = 'AddColumnCheckInDateToUserTable1722929265172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "checkInDate" date NOT NULL DEFAULT '"2024-08-06T07:27:51.283Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "checkInDate"`);
    }

}
