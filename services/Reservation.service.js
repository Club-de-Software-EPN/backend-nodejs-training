const Database = require('../lib/Database');

class ReservationService {
    static _reservationServiceInstance = null;

    async getModels(){
        const {ReservationModel, UserModel, CourseModel} = await Database.getModels();
        this._reservationModel = ReservationModel;
        this._userModel = UserModel;
        this._courseModel = CourseModel;
    }

    static async getInstance() {
        if (ReservationService._reservationServiceInstance === null) {
            ReservationService._reservationServiceInstance = new ReservationService();
            await ReservationService._reservationServiceInstance.getModels();
        }
        return ReservationService._reservationServiceInstance;
    }

    async getAll() {
        return this._reservationModel.findAll();
    }

    async getOne(uuid) {
        return this._reservationModel.findOne({
            where:{
                uuid
            }
        });
    }

    async create() {
        
    }

    async update() {}

    async delete() {}
}

module.exports = ReservationService;
