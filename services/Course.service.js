class CourseService {
    static _courseServiceInstance = null;

    static getInstance() {
        if (CourseService._courseServiceInstance === null) {
            CourseService._courseServiceInstance = new CourseService();
        }
        return CourseService._courseServiceInstance;
    }
}

module.exports = CourseService;
