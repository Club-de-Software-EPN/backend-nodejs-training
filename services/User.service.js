const { v4: uuidv4 } = require('uuid');

const users = [
    {
        id: 1,
        uuid: 'abcd-123',
        name: 'John',
        lastName: 'Doe',
        email: 'example@exmple.com',
        password: '123456',
        phone: '123456789',
        organization: 'Example',
    }
];

class UserService {
    static _userServiceInstance = null;

    constructor() {}

    static getInstance() {
        if (!UserService._userServiceInstance) {
            UserService._userServiceInstance = new UserService();
        }
        return UserService._userServiceInstance;
    }

    getAll() {
        return users;
    }

    getOne(uuid) {
        return users.find((user) => user.uuid === uuid);
    }

    create(name, lastName, email, phone, organization) {
        const user = {
            id: users.length + 1,
            uuid: uuidv4(),
            name,
            lastName,
            email,
            phone,
            organization
        }
        users.push(user);
        return user;
    }

}

module.exports = UserService;
