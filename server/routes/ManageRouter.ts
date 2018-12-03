
import { CustomRouter } from '../models/CustomRouter';
import { User } from './user';

export class ManageRouter extends CustomRouter{
    
    private userRoutes =  new User().export();
    
    constructor(){
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.use('/users',this.userRoutes);
        this.router.get('/', function(_, res) {
            res.header('Content-Type', 'text/plain');
            res.json('The API is working!');
        });
    }
    
}