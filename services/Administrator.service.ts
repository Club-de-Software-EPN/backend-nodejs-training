import Database from '../lib/Database';
import bcrypt from 'bcrypt';

class AdministratorService {
    static _administratorServiceInstance: AdministratorService;

    _administratorModel: any;
    _authModel: any;

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

    async getOne(id: string) {
        return this._administratorModel.findOne({
            where: {
                id,
            }
        });
    }

    async create(name: string, lastName: string, email:string, password:string) {
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

    async update(uuid?:string ,name?:string, lastName?: string, email?: string, password?: string) {
        if(password){
            const hashedPassword = await bcrypt.hash(password,10);
            const user = await this._administratorModel.findOne({
                where: {uuid},
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

    async delete(id: string) {
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
