const knex = require("knex");

class SQLClient {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla;
    }

    async save(data) {
        try {
            await this.knex(this.tabla).insert(data)
            console.log("data cargada correctamente");
        }
        catch(error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            const data = await this.knex.from(this.tabla).select("*");
            return data;
        }
        catch(error) {
            console.log(error);
        }
    }

    async getById(number) {
        try {
            const data = await this.knex.from(this.tabla).select("*")
            .where({ id: number });
            return data;
        }
        catch(error) {
            console.log(error);
        }
    }

    async updateById(number, product) {
        try {
            await this.knex.from(this.tabla)
                .where("id", number)
                .update(product)
                console.log("data modificada correctamente")
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteById(number) {
        try {
            await this.knex.from(this.tabla)
                .where("id", number)
                .del()
                console.log("data eliminada correctamente")
        }
        catch (error) {
            console.log(error);
        }
    }
}




module.exports = SQLClient;
