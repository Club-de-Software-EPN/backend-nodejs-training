class CourseService {
    static _courseServiceInstance = null;

    static getInstance() {
        if (CourseService._courseServiceInstance === null) {
            CourseService._courseServiceInstance = new CourseService();
        }
        return CourseService._courseServiceInstance;
    }

    async getAll() {}

    async getOne() {}

    async create() {}

    async update() {}

    async delete() {}

    async getAllReservations() {}

    async addReservation() {}
}

module.exports = CourseService;
