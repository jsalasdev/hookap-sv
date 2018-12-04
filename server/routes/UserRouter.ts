import { CustomRouter } from "../models/CustomRouter";
import { Request, Response } from 'express';
import User from '../models/User';

export class UserRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/:id',this.getUserById);
    }
    
    getUserById = (req: Request, res: Response) => {
        let id:any = req.params.id;
        if(!id){
            return res.status(400).json({
                ok:false,
                error: 'User id expected.'
            });
        }
        
        User.findById(id)
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'User not exists.'
                    }
                });
            }

            res.json({
                ok: true,
                user
            });
        });
    }

}