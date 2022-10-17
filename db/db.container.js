const dbconfig = require("./config");
const knex = require("knex")(dbconfig.mariaDB);
// las lineas 1 y 2 deberian estar dentro del constructor? como hago eso?

class Productos {

    constructor(tabla) {
        
        this.tabla = tabla;
    }

    async save(producto) {
        try {
            await knex(this.tabla).insert(producto)
            console.log("productos agregados correctamente");
        }
        catch(error) {
            console.log(error);
        }
        finally {
            knex.destroy();
        }
            
    }

    async getAll() {
        try {
            const dataProducts = await knex.from("productos").select("*");
            return dataProducts;
        }
        catch(error) {
            console.log(error);
        }
        finally {
            knex.destroy();
        }
    }

    async createTable() {
        const exist = await knex.schema.hasTable(this.tabla);
        if (!exist) {
            knex.schema.createTable(this.tabla, table => {
                table.increments("id");
                table.string("name").notNullable().defaultTo("N/A")
                table.string("thumbnail").notNullable()
                table.string("description", 500)
                table.integer("price")
                table.integer("stock")
                table.integer("code").unique()
            })
        }
    }

    async dropTable() {
        const exist = await knex.schema.hasTable(this.tabla);
        if (exist) {
            return knex.schema.dropTable(this.tabla);
        }
    }



}




module.exports = Productos;
