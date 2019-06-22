import * as boom from 'boom';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { compareSync } from 'bcrypt';

export class LoginController {
    // POST
    public loginRoute;
    
    constructor() {
        this.initBaseRoutes();
    }

    private initBaseRoutes(): void {
        this.loginRoute = () => {
            return {
                method: 'POST',
                path: '/login',
                config: {
                    auth: false,
                    description: 'Endpoint used for login and receiving the authentication token',
                    notes: 'Endpoint used for login and receiving the authentication token',
                    tags: ['api', 'v1'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                '200': {
                                    description: 'Success'
                                }
                            }
                        }
                    }
                },
                handler: async (request, h) => {
                    const user = await User.findOne({email: request.payload.email});

                    if (user && compareSync(request.payload.password, user.password)) {
                        const expirationTime: number = 60 * 60 * 24 * 7; // 1 week
                        const tokenData = {
                            id: user._id,
                            email: user.email,
                            name: user.name,
                            scope: user.role,
                            exp: Math.floor(Date.now() / 1000) + expirationTime
                        };

                        return h.response({ 
                            statusCode: 200,
                            message: 'Successfully Authenticated',
                            user: {
                                id: user._id,
                                email: user.email,
                                name: user.name,
                                token: jwt.sign(tokenData, 'privateKey123', { algorithm: 'HS256' })
                            } 
                        })
                        .code(200);
                    }

                    return boom.unauthorized('Invalid email or password');
                }
            }
        }
    }

    public getRouteList(): any[] {
        return [
            this.loginRoute()
        ];
    }
}
