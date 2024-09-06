import { MigrationInterface, QueryRunner } from "typeorm";

export class EditColumnCheckInDateToUserTable1722931740291 implements MigrationInterface {
    name = 'EditColumnCheckInDateToUserTable1722931740291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "checkInDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "checkInDate" TIMESTAMP NOT NULL DEFAULT '"2024-08-06T08:09:05.959Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "checkInDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "checkInDate" date NOT NULL DEFAULT '2024-08-06'`);
    }

}
