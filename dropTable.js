const knex = require("knex");

    const dropTable = async (tableName) => {
        const exist = await knex.schema.hasTable(tableName);
        if (exist) {
            return knex.schema.dropTable(tableName);
        }
    }