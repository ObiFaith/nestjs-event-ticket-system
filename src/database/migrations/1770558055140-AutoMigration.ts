import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1770558055140 implements MigrationInterface {
    name = 'AutoMigration1770558055140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_c621508a2b84ae21d3f971cdb47"`);
        await queryRunner.query(`ALTER TABLE "ticket_types" DROP CONSTRAINT "FK_0bf6c025aea56d71d7c0a019f9e"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4a2bb5800bf09aec7827ecb6085"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_1d45b2dec9dcc531412e537958c"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "creatorId" TO "creator_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_types" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "ticketTypeId"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "cart_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "ticket_type_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_977625e8b50621bfb1c7f3d02b"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_977625e8b50621bfb1c7f3d02b" ON "carts" ("user_id", "status") `);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_b51705459da0b0977cf32d6291e" UNIQUE ("cart_id", "ticket_type_id")`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_39f98b48445861611ea17108071" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_types" ADD CONSTRAINT "FK_9dfa62b35548ea1e0b7e4675b20" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_f38335e7b984e46d6872fbddb94" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_f38335e7b984e46d6872fbddb94"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "ticket_types" DROP CONSTRAINT "FK_9dfa62b35548ea1e0b7e4675b20"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_39f98b48445861611ea17108071"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_b51705459da0b0977cf32d6291e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_977625e8b50621bfb1c7f3d02b"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_977625e8b50621bfb1c7f3d02b" ON "carts" ("status", "user_id") `);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "ticket_type_id"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "cart_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "ticketTypeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "cartId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket_types" ADD "eventId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "creator_id" TO "creatorId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_1d45b2dec9dcc531412e537958c" UNIQUE ("cartId", "ticketTypeId")`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4a2bb5800bf09aec7827ecb6085" FOREIGN KEY ("ticketTypeId") REFERENCES "ticket_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_types" ADD CONSTRAINT "FK_0bf6c025aea56d71d7c0a019f9e" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_c621508a2b84ae21d3f971cdb47" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
