import { Sequelize } from 'sequelize';

import env from '../utils/Config';
import UserModel from '../models/User.model';
import AuthModel from '../models/Auth.model';
import AdministratorModel from '../models/Administrator.model';
import CourseModel from '../models/Course.model';
import ReservationModel from '../models/Reservation.model';
import Console from './Console';

const apiConsole = new Console('Database');

class Database {
    private static instance: Sequelize;

    static async getModels() {
      apiConsole.success('Setting up database');
      if (!Database.instance) {
        Database.instance = new Sequelize({
          dialect: env.db.dialect,
          host: env.db.host,
          port: env.db.port,
          username: env.db.username,
          password: env.db.password,
          database: env.db.database,
        });

        UserModel.setup(Database.instance);
        AuthModel.setup(Database.instance);
        AdministratorModel.setup(Database.instance);
        CourseModel.setup(Database.instance);
        ReservationModel.setup(Database.instance);

        // Define relationships
        UserModel.hasOne(AuthModel);
        AdministratorModel.hasOne(AuthModel);

        UserModel.hasMany(ReservationModel);
        ReservationModel.belongsTo(UserModel);

        CourseModel.hasMany(ReservationModel);
        ReservationModel.belongsTo(CourseModel);

        AdministratorModel.hasMany(CourseModel);

        await Database.instance.sync();
      }
      return {
        UserModel,
        AuthModel,
        AdministratorModel,
        CourseModel,
        ReservationModel,
      };
    }
}

export default Database;
