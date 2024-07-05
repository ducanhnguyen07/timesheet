import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAvatarToUser1719902137936 implements MigrationInterface {
    name = 'AddColumnAvatarToUser1719902137936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
