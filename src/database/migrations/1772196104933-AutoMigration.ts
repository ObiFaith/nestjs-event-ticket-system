import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772196104933 implements MigrationInterface {
    name = 'AutoMigration1772196104933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    }

}
