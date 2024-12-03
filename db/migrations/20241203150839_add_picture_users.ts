import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    //add picture field 
    return knex.schema.table("users", (table) => {
        table.string("picture");
        table.string("name");
    });
}


export async function down(knex: Knex): Promise<void> {
}

