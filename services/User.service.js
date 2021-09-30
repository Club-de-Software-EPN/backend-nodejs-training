class UserService {
    static _userServiceIntance = null;

    constructor() {}

    static getInstance() {
        if (!UserService._userServiceIntance) {
            UserService._userServiceIntance = new UserService();
        }
        return UserService._userServiceIntance;
    }

    login (email, password) {
        if (email !== 'admin@epn.edu.ec') {
            return false;
        }
        if (password !== 'admin') {
            return false;
        }
        return true;
    }
}

module.exports = UserService;
