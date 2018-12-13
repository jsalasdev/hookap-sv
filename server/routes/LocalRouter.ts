import { CustomRouter } from "../models/CustomRouter";
import { verifyJwt } from '../middlewares/Authentication';
import { LocalDocument, Local } from '../models/Local';
import { UserDocument } from '../models/User';

const _ = require('underscore');



export class LocalRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/',verifyJwt, this.getMyLocals);
        this.router.post('/', verifyJwt, this.addLocal);
        this.router.get('/:id', verifyJwt, this.getLocalById);
        this.router.put('/:id', verifyJwt, this.updateLocal);
        this.router.delete('/:id', verifyJwt, this.deleteLocal);
    }
    
    getMyLocals = (req: any, res:any) => {
        let user: UserDocument = req.user;
        Local.find( {userOwner: user._id}, (err, locals) => {
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
                locals
            });
        });
    }
    
    addLocal = (req: any, res:any) => {
        let user:UserDocument = req.user;
        let body = req.body;
        console.log(body);
        let local = new Local({
            name: body.name,
            availableHookahs:  body.availableHookahs,
            userOwner: user._id,
            premiumTobaccoPrice: body.premiumTobaccoPrice,
            tobaccoPrice: body.tobaccoPrice,
            tobaccos: body.tobaccos,
            location: body.location
        });
        
        local.save((err: any, local:LocalDocument) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: err
                    }
                });
            };
            return res.json({
                ok: true,
                local
            });
        });
        
    }
    
    getLocalById = (req: any, res:any) => {
        
        let id = req.params.id;
        if(!id){
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'Local id expected.'
                }
            });
        }
        
        Local.findById(id)
        .exec((err: any, local: LocalDocument) => {
            if (err || !local) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Local not found.'
                    }
                });
            }
            
            res.json({
                ok: true,
                local
            });
        });
    }
    
    //solo lo puede actualizar el dueño
    updateLocal = (req:any, res: any) =>{
        let id:any = req.params.id;
        let user:UserDocument = req.user;
        
        if(!id){
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'Local id expected.'
                }
            });
        }
        
        Local.findById(id)
        .exec((err:any, local: LocalDocument) => {
            if (err || !local) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Local not found.'
                    }
                });
            }else{
                if(local && user._id == local.userOwner ){
                    Local.findOneAndUpdate(id,req.body, {new:true}, (err:any, updatedLocal:any) => {
                        if(err){
                            return res.status(400).json({
                                ok: false,
                                error: {
                                    message: 'SERVER ERROR.'
                                }
                            });
                        }
                        res.json({
                            ok: true,
                            local: updatedLocal
                        });
                    });
                }else{
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            }
        });
    }
    
    //solo lo puede eliminar el dueño
    deleteLocal = (req:any, res: any) => {
        let id:any = req.params.id;
        let user:UserDocument = req.user;
        
        if(!id){
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'Local id expected.'
                }
            });
        }
        
        Local.findById(id, (err, local: LocalDocument) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    error: {
                        message: 'SERVER ERROR.'
                    }
                });
            }
            
            if(local && user._id == local.userOwner ){
                Local.deleteOne({_id:id},(err) => {
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
                        local
                    });
                    
                });
                
            }else{
                return res.status(403).json({
                    ok: false,
                    error: {
                        message: 'Not permissions'
                    }
                });
            }
        });
    }
}