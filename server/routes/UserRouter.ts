import { CustomRouter } from "../models/CustomRouter";
import { Request, Response } from 'express';
import User from '../models/User';
import { verifyJwt } from '../middlewares/Authentication';

export class UserRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/:id', verifyJwt, this.getUserById);
        this.router.post('/hookah/counter', verifyJwt, this.addHookahCounter);
    }
    
    addHookahCounter = (req: any, res: any) => {
        let user = req.user;
            if(user !== undefined){
                let hookahCounter:any[] = user.hookahCounter;
                let newCount = Date.now();

                if(hookahCounter.length>0){
                    let aux = hookahCounter[hookahCounter.length-1];
                    console.log(Date.now()-aux.createdAt);
                }

                //ERROR HERE ********************************
                User.findById(user._id, (err:any , user: User) => {
                    if(err){
                        return res.status(500).json({
                            ok:false,
                            error: {
                                message: 'SERVER ERROR.'
                            }
                        });
                    }else{
                        user.hookahCounter.push(newCount);
                        user.save
                    }
                });
            }
            res.status(200).json({
                ok:true,
                error: {
                    message: 'testing'
                }
             });
    }

    getUserById = (req: Request, res: Response) => {
        let id:any = req.params.id;
        if(!id){
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'User id expected.'
                }
            });
        }
        
        User.findById(id)
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'User not found.'
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