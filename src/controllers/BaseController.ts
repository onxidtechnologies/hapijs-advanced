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
        this.addEntityRoute = (scope: string[]) => {
            return {
                method: 'POST',
                path: `/${this.entitySingular}`,
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    },
                    description: 'Endpoint used to create ' + this.entitySingular,
                    notes: 'Endpoint used to create ' + this.entitySingular,
                    tags: ['api', 'v1'],
                    plugins: {
                        'hapi-swagger': {
                            responses: {
                                '201': {
                                    description: 'Created'
                                }
                            }
                        }
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

        this.getAllEntitiesRoute = (scope: string[]) => {
            return {
                method: 'GET',
                path: `/${this.entitySingular}`,
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    },
                    description: 'Endpoint used to get ' + this.entityPlural,
                    notes: 'Endpoint used to get ' + this.entityPlural,
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
                    const entities = await this.model.find({});

                    return h.response(entities).code(200);
                }
            }
        }

        this.getEntityByIdRoute = (scope: string[]) => {
            return {
                method: 'GET',
                path: `/${this.entitySingular}/{id}`,
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    },
                    description: 'Endpoint used to get ' + this.entitySingular,
                    notes: 'Endpoint used to get ' + this.entitySingular,
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
                    const entity = await this.model.findById(request.params.id);
                    if (entity) {
                        return h.response(entity).code(200);
                    } else {
                        return boom.notFound('Entity not found');
                    }
                }
            }
        }

        this.updateEntityByIdRoute = (scope: string[]) => {
            return {
                method: 'PUT',
                path: `/${this.entitySingular}/{id}`,
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    },
                    description: 'Endpoint used to update ' + this.entitySingular,
                    notes: 'Endpoint used to update ' + this.entitySingular,
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

        this.deleteEntityByIdRoute = (scope: string[]) => {
            return {
                method: 'DELETE',
                path: `/${this.entitySingular}/{id}`,
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    },
                    description: 'Endpoint used to delete ' + this.entitySingular,
                    notes: 'Endpoint used to delete ' + this.entitySingular,
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