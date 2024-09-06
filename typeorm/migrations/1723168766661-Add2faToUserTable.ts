import { MigrationInterface, QueryRunner } from "typeorm";

export class Add2faToUserTable1723168766661 implements MigrationInterface {
    name = 'Add2faToUserTable1723168766661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "secretKey" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "checkInDate" SET DEFAULT '"2024-08-09T01:59:32.521Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "checkInDate" SET DEFAULT '2024-08-07 03:36:11.7'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secretKey"`);
    }

}
