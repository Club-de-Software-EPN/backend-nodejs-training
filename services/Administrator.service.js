class AdministratorService {
    static _administratorServiceInstance = null;

    static getInstance() {
        if (CourseService._administratorServiceInstance === null) {
            CourseService._administratorServiceInstance = new AdministratorService();
        }
        return CourseService._administratorServiceInstance;
    }
}

module.exports = AdministratorService;
