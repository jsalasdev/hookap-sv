
import { CustomRouter } from '../models/CustomRouter';
import { UserRouter } from './UserRouter';
import { AuthRouter } from './AuthRouter';

export class ManageRouter extends CustomRouter{
    
    private userRoutes =  new UserRouter().export();
    private authRoutes = new AuthRouter().export();

    constructor(){
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.use('/users',this.userRoutes);
        this.router.use('/login',this.authRoutes);
        this.router.get('/', function(_, res) {
            res.header('Content-Type', 'text/plain');
            res.json('The API is working, but not for you ): !');
        });
    }
    
}