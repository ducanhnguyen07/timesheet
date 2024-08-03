import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenColumnToUsertable1722239128540 implements MigrationInterface {
    name = 'AddRefreshTokenColumnToUsertable1722239128540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    }

}
