import { CustomRouter } from "../models/CustomRouter";
import { Request, Response } from 'express';
import User from '../models/User';

export class UserRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/',this.getUsers);
    }
    
    getUsers = (req: Request, res: Response) => {
        
        let user = new User({
            email: 'dasdas'
        });

        res.json({
            ok: true,
            user
        });
    }

}