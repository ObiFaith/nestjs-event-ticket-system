import { MigrationInterface, QueryRunner } from "typeorm";


export class AutoMigration1770500204894 implements MigrationInterface {
    name = 'AutoMigration1770500204894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_43f41d4ff2ba94d9d00875a253"`);
        await queryRunner.query(`ALTER TABLE "ticket_types" ADD "price" integer NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "ticket_types"."price" IS 'Price in smallest currency unit (e.g. kobo, cents)'`);
        await queryRunner.query(`ALTER TABLE "ticket_types" ADD "currency" character varying(3) NOT NULL DEFAULT 'NGN'`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "events"."status" IS 'ENDED and CANCELLED events cannot accept ticket reservations'`);
        await queryRunner.query(`COMMENT ON COLUMN "carts"."status" IS 'ACTIVE carts can reserve tickets; EXPIRED carts must release reservations'`);
        await queryRunner.query(`ALTER TABLE "ticket_types" ADD "event_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_9dfa62b35548ea1e0b7e4675b2" ON "ticket_types" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_977625e8b50621bfb1c7f3d02b" ON "carts" ("user_id", "status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_977625e8b50621bfb1c7f3d02b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9dfa62b35548ea1e0b7e4675b2"`);
        await queryRunner.query(`COMMENT ON COLUMN "carts"."status" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "events"."status" IS NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_types" DROP COLUMN "currency"`);
        await queryRunner.query(`COMMENT ON COLUMN "ticket_types"."price" IS 'Price in smallest currency unit (e.g. kobo, cents)'`);
        await queryRunner.query(`ALTER TABLE "ticket_types" DROP COLUMN "price"`);
        await queryRunner.query(`CREATE INDEX "IDX_43f41d4ff2ba94d9d00875a253" ON "carts" ("status", "userId") `);
    }

}
