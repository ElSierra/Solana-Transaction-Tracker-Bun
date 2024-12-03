import { table } from "console";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
  });
}
