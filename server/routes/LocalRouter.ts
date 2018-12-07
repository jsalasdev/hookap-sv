import { CustomRouter } from "../models/CustomRouter";
import { verifyJwt } from '../middlewares/Authentication';
import { LocalDocument, Local } from '../models/Local';
import { UserDocument } from '../models/User';


export class LocalRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/',verifyJwt, this.getMyLocals);
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
        
    }

    getLocalById = (req: any, res:any) => {
        
    }
    
    //solo lo puede eliminar el dueño
    deleteLocal = (req:any, res: any) => {
        
    }
    
    //solo lo puede actualizar el dueño
    updateLocal = (req:any, res: any) =>{
        
    }

    //solo lo puede actualizar el dueño
    addTobaccoToLocal = (req: any, res:any) => {
        
    }

}