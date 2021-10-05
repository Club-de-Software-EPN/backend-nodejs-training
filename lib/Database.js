const { Sequelize } = require("sequelize");

const UserModel = require('../models/User.model');
const AuthModel = require('../models/Auth.model');

class Database {
    static _instance = null;

    static async getModels (){
        if(!Database._instance){
            Database._instance = new Sequelize({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'admin@admin.com',
                password: 'admin',
                database: 'my_db'
            });
            UserModel.setup(Database._instance);
            AuthModel.setup(Database._instance);

            // Define relationships
            UserModel.hasOne(AuthModel);

            await Database._instance.sync({ force: true });
        }
        return {
            UserModel,
            AuthModel
        }
    }
}

module.exports = Database;