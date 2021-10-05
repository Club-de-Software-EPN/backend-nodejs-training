const { Model, DataTypes } = require('sequelize');
class Auth extends Model {
    static setup(sequelize) {
        Auth.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            password: {
                type: DataTypes.STRING,
            },
            isActiveAccount: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }
        }, {
            sequelize,
            modelName: 'auth'
        });
    }
}

module.exports = Auth;
