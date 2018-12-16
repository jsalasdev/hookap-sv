import { CustomRouter } from "../models/CustomRouter";
import { Request, Response } from 'express';
import { verifyJwt } from '../middlewares/Authentication';
import { UserDocument, User } from '../models/User';

const _ = require('underscore');

export class UserRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/favorite-locals', verifyJwt, this.getFavoriteLocal);
        this.router.delete('/favorite-locals',verifyJwt, this.deleteFavoriteLocal);
        this.router.post('/favorite-locals',verifyJwt, this.addFavoriteLocal);
        this.router.get('/:id', verifyJwt, this.getUserById);
        this.router.post('/hookah/counter', verifyJwt, this.addHookahCounter);
        this.router.delete('/hookah/counter', verifyJwt, this.deleteHookahCounter);
        this.router.put('/',verifyJwt, this.updateProfile);
    }
    
    getFavoriteLocal = (req:any, res:any) => {
        let user:UserDocument = req.user;
        User.findById(user._id, { favoriteLocals: 1 })
        .populate('favoriteLocals')
        .exec((err, user) => {
            console.log(err);
            if(err){
                return res.status(500).json({
                    ok:false,
                    error: {
                        message: 'SERVER ERROR.'
                    }
                });
            }
            res.json({
                ok: true,
                user
            });
        });
    }
    
    addFavoriteLocal = (req: any, res:any) => {
        let user:UserDocument = req.user;
        let idLocal = req.query.id;
        if(idLocal){
            
            User.findById(user._id, {favoriteLocals:1}, (err, user: UserDocument)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }
                
                let localExists = user.favoriteLocals.find(x => x == idLocal);
                if(localExists){
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'Este local ya es favorito'
                        }
                    });
                }else{
                    user.favoriteLocals.push(idLocal);
                    User.updateOne(user, (err:any, u:UserDocument) => {
                        
                        if(err){
                            return res.status(500).json({
                                ok:false,
                                error: {
                                    message: 'SERVER ERROR.'
                                }
                            });
                        }
                        
                        res.status(200).json({
                            ok:true,
                            error: {
                                ok:true,
                                user
                            }
                        });
                    });
                }
            });
        }else{
            return res.json({
                ok: false,
                error:{
                    message: "Id local expected."
                }
            });
        }
    }
    
    //APLICAR DELETE ON CASCADE
    deleteFavoriteLocal = (req:any, res:any) => {
        let user:UserDocument = req.user;
        let idLocal = req.query.id;
        if(idLocal){
            
            User.findById(user._id, {favoriteLocals:1}, (err, user: UserDocument)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }
                
                let localExists = user.favoriteLocals.find(x => x == idLocal);
                if(localExists){
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'Este local ya es favorito'
                        }
                    });
                }else{
                    let updatedLocals:number[] = [];
                    for(let i in user.favoriteLocals){
                        if(Number(i) !== localExists){
                            updatedLocals.push(Number(i));
                        }
                    }
                    user.favoriteLocals = updatedLocals;
                    User.updateOne(user, (err:any, u:UserDocument) => {
                        
                        if(err){
                            return res.status(500).json({
                                ok:false,
                                error: {
                                    message: 'SERVER ERROR.'
                                }
                            });
                        }
                        
                        res.status(200).json({
                            ok:true,
                            error: {
                                ok:true,
                                user
                            }
                        });
                    });
                }
            });
        }else{
            return res.json({
                ok: false,
                error:{
                    message: "Id local expected."
                }
            });
        }
    }
    
    addHookahCounter = (req: any, res: any) => {
        let user:UserDocument = req.user;
        if(user !== undefined){
            User.findById(user._id, (err:any , user:UserDocument) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }else{
                    user.hookahCounter++;
                    User.updateOne(user, (err:any, u:UserDocument) => {
                        res.status(200).json({
                            ok:true,
                            error: {
                                ok:true,
                                user
                            }
                        });
                    });
                }
            });
        }
    }
    
    deleteHookahCounter = (req: any, res: any) => {
        let user:UserDocument = req.user;
        if(user !== undefined){
            User.findById(user._id, (err:any , user:UserDocument) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }else{
                    if(user.hookahCounter > 0){
                        user.hookahCounter--;
                        User.updateOne(user, (err:any, u:UserDocument) => {
                            res.status(200).json({
                                ok:true,
                                error: {
                                    ok:true,
                                    user
                                }
                            });
                        });
                    }else{
                        res.status(200).json({
                            ok:true,
                            error: {
                                ok:true,
                                user
                            }
                        });
                    }
                }
            });
        }
    }
    
    updateProfile = (req: any, res: any) => {
        let user:UserDocument = req.user;
        let body = _.pick(req.body, ['userType']);
        User.findByIdAndUpdate(user._id, body, {new: true, runValidators:true}, (err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'SERVER ERROR.'
                    }
                });
            }
            res.json({
                ok: true,
                user: updatedUser
            });
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
        .exec((err:any, user:UserDocument) => {
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