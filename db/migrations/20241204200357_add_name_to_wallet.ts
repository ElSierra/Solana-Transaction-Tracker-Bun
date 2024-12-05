import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("wallets", (table) => {
        table.string("name").notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
}

