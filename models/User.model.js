const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static setup(sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: {
                type: DataTypes.UUID,
                unique: true,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING,
            },
            organization:{
                type: DataTypes.STRING,
            },
        }, {
            sequelize,
            modelName: 'user'
        });
    }
}

module.exports = User;
