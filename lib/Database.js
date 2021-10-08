const { Sequelize } = require("sequelize");

const { db } = require('../utils/Config');
const UserModel = require('../models/User.model');
const AuthModel = require('../models/Auth.model');
const AdministratorModel = require('../models/Administrator.model');
const CourseModel = require('../models/Course.model');
const ReservationModel = require('../models/Reservation.model');

class Database {
    static _instance = null;

    static async getModels (){
        if(!Database._instance){
            Database._instance = new Sequelize({
                dialect: db.dialect,
                host: db.host,
                port: db.port,
                username: db.username,
                password: db.password,
                database: db.database,
            });

            UserModel.setup(Database._instance);
            AuthModel.setup(Database._instance);
            AdministratorModel.setup(Database._instance);
            CourseModel.setup(Database._instance);
            ReservationModel.setup(Database._instance);

            // Define relationships
            UserModel.hasOne(AuthModel);
            AdministratorModel.hasOne(AuthModel);

            UserModel.hasMany(ReservationModel);
            ReservationModel.belongsTo(UserModel);

            CourseModel.hasMany(ReservationModel);
            ReservationModel.belongsTo(CourseModel);

            AdministratorModel.hasMany(CourseModel);

            await Database._instance.sync();
        }
        return {
            UserModel,
            AuthModel,
            AdministratorModel,
            CourseModel,
            ReservationModel
        }
    }
}

module.exports = Database;