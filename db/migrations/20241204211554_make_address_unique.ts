import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("wallets", (table) => {
        table.unique("address");
    });
}


export async function down(knex: Knex): Promise<void> {
}

