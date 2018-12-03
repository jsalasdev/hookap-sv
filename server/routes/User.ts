import { CustomRouter } from "../models/CustomRouter";
import { Request, Response } from 'express';

export class User extends CustomRouter {

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes(){
        this.router.get('/',this.getUsers);
    }

    getUsers = (req: Request, res: Response) => {
        res.json({
            ok: true,
            clients: 'Its works'
        });
    }

}