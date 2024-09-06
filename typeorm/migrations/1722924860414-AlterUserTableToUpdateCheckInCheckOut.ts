import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTableToUpdateCheckInCheckOut1722924860414 implements MigrationInterface {
    name = 'AlterUserTableToUpdateCheckInCheckOut1722924860414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stWork" TIME NOT NULL DEFAULT '08:30:00'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "fiWork" TIME NOT NULL DEFAULT '17:30:00'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "checkIn" TIME NOT NULL DEFAULT '08:30:00'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "checkOut" TIME NOT NULL DEFAULT '17:30:00'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "checkInToken" character varying NOT NULL DEFAULT '0000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "checkInToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "checkOut"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "checkIn"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fiWork"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stWork"`);
    }

}
