import { Knex } from "knex";

const TABLE_NAME = "links";

/**
 * Alter links table to change url type to text
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.text("url").notNullable().alter();
  });
}

/**
 * Alter links table to change url type to string(varchar)
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.string("url", 255).notNullable().alter();
  });
}
