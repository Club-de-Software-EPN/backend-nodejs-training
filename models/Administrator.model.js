const { Model, DataTypes } = require('sequelize');

class Administrator extends Model {
    static setup(sequelize) {
        Administrator.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            modelName: 'Administrator'
        });
    }
}

module.exports = Administrator;
