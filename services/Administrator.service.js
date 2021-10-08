const Database = require('../lib/Database');
const bcrypt = require('bcrypt');

class AdministratorService {
    static _administratorServiceInstance = null;

    async getModels(){
        const {AdministratorModel, AuthModel} = await Database.getModels();
        this._administratorModel = AdministratorModel;
        this._authModel = AuthModel;
    }
    static async getInstance() {
        if (AdministratorService._administratorServiceInstance === null) {
            AdministratorService._administratorServiceInstance = new AdministratorService();
            await AdministratorService._administratorServiceInstance.getModels();
        }
        return AdministratorService._administratorServiceInstance;
    }

    async getAll() {
        return this._administratorModel.findAll();
    }

    async getOne(id) {
        return this._administratorModel.findOne({
            where: {
                id: parseInt(id)
            }
        });
    }

    async create(name, lastName, email, password) {
        const administrator = await this._administratorModel.create({
            name,
            lastName,
            email
        });
        const hashedPassword = await bcrypt.hash(password,10);
        const auth = await this._authModel.create({
            password: hashedPassword
        });
        await administrator.setAuth(auth);
        return administrator;
    }

    async update(id,name, lastName, email, password) {
        if(password){
            const hashedPassword = await bcrypt.hash(password,10);
            const user = await this._administratorModel.findOne({
                where: {id},
                include: [{
                    model: this._authModel
                }]
            });
            const auth = await user.getAuth();
            await this._authModel.update({
                password: hashedPassword
            },{
                where: {id: auth.id}
            });
        }
        const administratorUpdated = await this._administratorModel.update({
            name,
            lastName,
            email
        },{
            where: {id},
            returning: true
        })
        return administratorUpdated[1];
    }

    async delete(id) {
        const administrator = await this._administratorModel.findOne({
            where: {id},
            include: [{
                model: this._authModel
            }]
        });
        const auth = await administrator.getAuth();
        await administrator.destroy();
        await auth.destroy();
        return administrator
    }
}

module.exports = AdministratorService;
