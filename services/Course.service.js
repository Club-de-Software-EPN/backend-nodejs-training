const Database = require('../lib/Database');

class CourseService {
    static _courseServiceInstance = null;

    async getModels(){
        const {CourseModel, AdministratorModel, ReservationModel} = await Database.getModels();
        this._courseModel = CourseModel;
        this._administratorModel = AdministratorModel;
        this._reservationModel = ReservationModel;
    }

    static async getInstance() {
        if (CourseService._courseServiceInstance === null) {
            CourseService._courseServiceInstance = new CourseService();
            await CourseService._courseServiceInstance.getModels()
        }
        return CourseService._courseServiceInstance;
    }

    async getAll() {
        return this._courseModel.findAll();
    }

    async getOne(slug) {
        return this._courseModel.findOne({
            where: {
                slug
            }
        }); 
    }

    async create(name, description, startDate, endDate, endInscriptionDate, themes, price) {
        /** ¿Idenficar al administrador que crea el curso ?*/
        const course = await this._courseModel.create({
            name,
            slug: name.replaceAll(' ','-'),
            description,
            startDate,
            endDate,
            endInscriptionDate,
            themes,
            price
        });
        //añadir el idAdmin a la fila del curso creado....
        return course;


    }

    async update() {}

    async delete() {}

    async getAllReservations() {}

    async addReservation() {}
}

module.exports = CourseService;
