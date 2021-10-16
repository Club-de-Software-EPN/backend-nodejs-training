const { Model, DataTypes } = require('sequelize');

class Reservation extends Model {
    static setup(sequelize) {
        Reservation.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            expirationDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            paymentStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            paymentImageUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            paymentDate: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        }, {
            sequelize,
            modelName: 'Reservation'
        })
    }
}

module.exports = Reservation;
