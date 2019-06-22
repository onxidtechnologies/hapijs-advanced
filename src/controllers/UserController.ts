import { User } from "../models/userModel";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
    constructor() {
        super(User);
        this.entitySingular = 'user';
        this.entityPlural = 'users';
        this.hashProperty = 'password';
    }

    public getRouteList(): any[] {
        return [
            this.addEntityRoute(['admin']), 
            this.getAllEntitiesRoute(['admin', 'user']), 
            this.getEntityByIdRoute(['admin', 'user']), 
            this.updateEntityByIdRoute(['admin', 'user']), 
            this.deleteEntityByIdRoute(['admin'])
        ];
    }
}