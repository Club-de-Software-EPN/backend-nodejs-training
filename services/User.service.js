const bcrypt = require('bcrypt');
const Database = require('../lib/Database');

class UserService {
    static _userServiceInstance = null;

    async getModels() {
        const { UserModel, AuthModel } = await Database.getModels();
        this._userModel = UserModel;
        this._authModel = AuthModel;
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
        const user = await this._userModel.update({
            email,
            name,
            lastName,
            phone,
            organization
        },{
            where: {
                uuid
            },
            returning: true
        } );
        const userAffected = user[1];
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            // console.log("Antes de actualizar");
            // console.log(userAffected);
            await this._authModel.update({
                password: hashedPassword
            },{
                where:{
                    userId: userAffected[0].dataValues.id
                }
            });
        }
        return userAffected[0].dataValues;
    }

    async delete(uuid) {
        const user = await this._userModel.findOne({
            where: {uuid},
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
        return null;
    }
}

module.exports = UserService;
