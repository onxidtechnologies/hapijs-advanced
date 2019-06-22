import * as boom from 'boom';
import { hashSync } from 'bcrypt';

export abstract class BaseController {
    private model: any;
    protected entitySingular: string;
    protected entityPlural: string;
    protected hashProperty: string;

    // POST
    protected addEntityRoute;
    // GET
    protected getAllEntitiesRoute;
    // GET 
    protected getEntityByIdRoute;
    // PUT
    protected updateEntityByIdRoute;
    // DELETE
    protected deleteEntityByIdRoute;

    constructor(model: any) {
        this.model = model;
        this.entitySingular = 'entity';
        this.entityPlural = 'entities';
        this.hashProperty = '';
        this.initBaseRoutes();
    }

    private initBaseRoutes(): void {
        this.addEntityRoute = () => {
            return {
                method: 'POST',
                path: `/${this.entitySingular}`,
                config: {
                    auth: {
                        strategy: 'jwt'
                    }
                },
                handler: async (request, h) => {
                    if (this.hashProperty != '' && request.payload[this.hashProperty]) {
                        request.payload[this.hashProperty] = hashSync(request.payload[this.hashProperty], 5);
                    }

                    const entity = await this.model.create(request.payload);

                    return h.response({ statusCode: 201, message: 'Successfully Created', 'id': entity._id }).code(201);
                }
            }
        }

        this.getAllEntitiesRoute = () => {
            return {
                method: 'GET',
                path: `/${this.entitySingular}`,
                config: {
                    auth: {
                        strategy: 'jwt'
                    }
                },
                handler: async (request, h) => {
                    const entities = await this.model.find({});

                    return h.response(entities).code(200);
                }
            }
        }

        this.getEntityByIdRoute = () => {
            return {
                method: 'GET',
                path: `/${this.entitySingular}/{id}`,
                config: {
                    auth: {
                        strategy: 'jwt'
                    }
                },
                handler: async (request, h) => {
                    const entity = await this.model.findById(request.params.id);
                    if (entity) {
                        return h.response(entity).code(200);
                    } else {
                        return boom.notFound('Entity not found');
                    }
                }
            }
        }

        this.updateEntityByIdRoute = () => {
            return {
                method: 'PUT',
                path: `/${this.entitySingular}/{id}`,
                config: {
                    auth: {
                        strategy: 'jwt'
                    }
                },
                handler: async (request, h) => {
                    const entity = await this.model.findById(request.params.id);
                    if (entity) {
                        if (this.hashProperty != '' && request.payload[this.hashProperty]) {
                            request.payload[this.hashProperty] = hashSync(request.payload[this.hashProperty], 5);
                        }
                        
                        await this.model.findByIdAndUpdate(request.params.id, request.payload);

                        return h.response({ statusCode: 200, message: 'Successfully Updated' }).code(200);
                    } else {
                        return boom.notFound('Entity not found');
                    }
                }
            }
        }

        this.deleteEntityByIdRoute = () => {
            return {
                method: 'DELETE',
                path: `/${this.entitySingular}/{id}`,
                config: {
                    auth: {
                        strategy: 'jwt'
                    }
                },
                handler: async (request, h) => {
                    const entity = await this.model.findById(request.params.id);
                    if (entity) {
                        await this.model.findByIdAndDelete(request.params.id);

                        return h.response({ statusCode: 200, message: 'Successfully Deleted' }).code(200);
                    } else {
                        return boom.notFound('Entity not found');
                    }
                }
            }
        }
    }

    public abstract getRouteList(): any[];
}