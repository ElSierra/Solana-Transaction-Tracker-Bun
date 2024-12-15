import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("wallets", (table) => {
        table.float("usdt").defaultTo(0).nullable();
        table.float("usdc").defaultTo(0).nullable();
    }
    );
}


export async function down(knex: Knex): Promise<void> {
}

