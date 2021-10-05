class AdministratorService {
    static _administratorServiceInstance = null;

    static getInstance() {
        if (CourseService._administratorServiceInstance === null) {
            CourseService._administratorServiceInstance = new AdministratorService();
        }
        return CourseService._administratorServiceInstance;
    }

    async getAll() {}

    async getOne() {}

    async create() {}

    async update() {}

    async delete() {}
}

module.exports = AdministratorService;
