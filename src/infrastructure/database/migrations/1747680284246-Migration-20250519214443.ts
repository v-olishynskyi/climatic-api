import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration202505192144431747680284246 implements MigrationInterface {
    name = 'Migration202505192144431747680284246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "subscribe_token"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "unsubscribe_token"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "subscription_token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "subscribed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "unsubscribed_at" TIMESTAMP`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_68d735c2db49c24862f05944ef" ON "subscriptions" ("subscription_token") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba579e1601e1d1c3385d5b6008" ON "subscriptions" ("frequency") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ba579e1601e1d1c3385d5b6008"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68d735c2db49c24862f05944ef"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "unsubscribed_at"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "subscribed"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "subscription_token"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "unsubscribe_token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "subscribe_token" character varying`);
    }

}
