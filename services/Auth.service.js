const Database = require('../lib/Database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { api } = require('../utils/Config');

class AuthService {
    static _authServiceInstance = null;

    async getModels() {
        const { UserModel, AuthModel, AdministratorModel } = await Database.getModels();
        this._userModel = UserModel;
        this._authModel = AuthModel;
        this._administratorModel = AdministratorModel;
    }

    static async getInstance() {
        if (AuthService._authServiceInstance === null) {
            AuthService._authServiceInstance = new AuthService();
            await AuthService._authServiceInstance.getModels();
        }
        return AuthService._authServiceInstance;
    }

    verifyToken(token) {
        return jwt.verify(token, api.secret);
    }

    generateToken(uuid) {
        return jwt.sign(
            {
                uuid,
            },
            api.secret,
        );
    }

    async userLogin(email, password) {
        const user = await this._userModel.findOne({
            where: {
                email,
            },
            include: [{
                model: this._authModel,
            }]
        });
        if (!user) {
            throw new Error('Credentials are not valid');
        }
        const auth = await user.getAuth();
        const isPasswordValid = await bcrypt.compare(password, auth.password);
        if (!isPasswordValid) {
            throw new Error('Credentials are not valid');
        }
        const token = this.generateToken(user.uuid);
        return token;
    }

    async adminLogin(email, password) {
        
    }
}

module.exports = AuthService;
