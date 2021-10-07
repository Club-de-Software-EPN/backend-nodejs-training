const bcrypt = require('bcrypt');
const Database = require('../lib/Database');

class UserService {
    static _userServiceInstance = null;

    async getModels() {
        const { UserModel, AuthModel, ReservationModel } = await Database.getModels();
        this._userModel = UserModel;
        this._authModel = AuthModel;
        this._reservationModel = ReservationModel;
    }

    static async getInstance() {
        if (!UserService._userServiceInstance) {
            UserService._userServiceInstance = new UserService();
            await UserService._userServiceInstance.getModels();
        }
        return UserService._userServiceInstance;
    }

    async getAll() {
        return this._userModel.findAll();
    }

    async getOne(uuid) {
        return this._userModel.findOne({
            where: { uuid }
        });
    }

    async create(name, lastName, email, phone, organization, password) {
        const user = await this._userModel.create({
            email,
            name,
            lastName,
            phone,
            organization
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        const auth = await this._authModel.create({
            password: hashedPassword
        });
        await user.setAuth(auth);
        return user;
    }

    async update(uuid, email, name, lastName, phone, organization, password) {
        if (!email && !name && !lastName && !phone && !organization && !password) {
            throw new Error('Nothing to update');
        }
        if (password) {
            const user = await this._userModel.findOne({
                where: {
                    uuid
                },
                include: [{
                    model: this._authModel
                }]
            })
            if (!user) {
                throw new Error('uuid is not valid');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const auth = await user.getAuth();
            await this._authModel.update({
                password: hashedPassword
            }, {
                where: {
                    id: auth.id
                }
            });
        }
        const result =  await this._userModel.update({
            email,
            name,
            lastName,
            phone,
            organization,
        }, { where: { uuid }, returning: true });
        const user = result[1];
        return user[0];
    }

    async delete(uuid) {
        const user = await this._userModel.findOne({
            where: { uuid },
            include: [{
                model: this._authModel
            }]
        });
        const auth = await user.getAuth();
        await user.destroy();
        await auth.destroy();
        return user;
    }

    async getReservations(uuid) {
        const user = await this._userModel.findOne({
            where: {
                uuid
            }
        });
        if (!user) {
            throw new Error('uuid not found')
        }
        const userReservations = await this._reservationModel.findAll({
            where: {
                userId: user.id
            }
        });
        if (userReservations.length === 0) {
            //if is an empty array-->the user doesn't have reservations
            return null;
        }
        return userReservations;
    }
}

module.exports = UserService;
