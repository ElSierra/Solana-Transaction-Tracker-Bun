import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.dropTable("wallets").dropTable("users");
}

export async function down(knex: Knex): Promise<void> {
 
}
