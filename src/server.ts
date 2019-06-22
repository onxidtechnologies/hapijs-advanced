import { Server } from '@hapi/hapi';
import * as mongoose from 'mongoose';
import { UserController } from './controllers/UserController';
import { LoginController } from './controllers/LoginController';
import { User } from './models/userModel';
const config = require('./config');

export class APIServer {
    private server: Server;

    constructor() {
        mongoose.connect(
            `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`,
            { useNewUrlParser: true }
        );

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        mongoose.connection.on('error', () => {
            console.log('Error while conneting to MongoDB');
        });
    }

    public async init() {
        // Create a server with a host and port
        this.server = Server({
            host: 'localhost',
            port: config.app.port
        });

        await this.server.register([
            require('hapi-auth-jwt2'),
            require('@hapi/inert'),
            require('@hapi/vision'),
            require('hapi-swagger')
        ]);

        this.server.auth.strategy('jwt', 'jwt', {
            key: 'privateKey123',
            validate: this.validate,
            verifyOptions: {
                algorithms: ['HS256']
            }
        });

        // Add the route
        this.server.route({
            method: 'GET',
            path: '/',
            handler: function (request, h) {

                return 'Hapi.js Advanced API Serving...';
            }
        });

        const userController = new UserController();
        this.server.route(userController.getRouteList());

        const loginController = new LoginController();
        this.server.route(loginController.getRouteList());

        try {
            await this.server.start();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Server running at:', this.server.info.uri);
    }

    private validate = async function (decoded, request, h) {
        const user = await User.findById(decoded.id);

        if (user) {
            return { isValid: true };
        }

        return { isValid: false };
    }
}
