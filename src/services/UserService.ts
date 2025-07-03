
import User from '../modelsSequelize/User.js';

// Extra libraries
import crypto from 'crypto';

class UserService {

    // Creation of FUA Format
    async createUserTest(data: { 
        username: string; 
        realPassword: string; 
        secretQuestion: string; 
        secretAnswer: string; } 
    ) {
        const auxSalt = crypto.randomBytes(125).toString('hex');

        const newUser = {
            username: data.username,
            salt: auxSalt,
            password: crypto.pbkdf2Sync(data.realPassword, auxSalt, 10000, 125, 'sha512').toString('hex'), 
            secretQuestion: data.secretQuestion,
            secretAnswer: crypto.pbkdf2Sync(data.secretQuestion, auxSalt, 10000, 125, 'sha512').toString('hex'),
            createdBy: -1
        }
        const userReturned = await User.create(newUser);
        return { uuid: userReturned.uuid };
    };
};

export default new UserService();
