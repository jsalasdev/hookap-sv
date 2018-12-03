import express from 'express';
import http from 'http';
import { SERVER_PORT } from '../config/Environment';
import { ManageRouter } from '../routes/ManageRouter';


export default class Server{
    
    private static _instance: Server;
    private manageRouter = new ManageRouter().export();
    public app:express.Application;
    public port:number;
    private httpServer: http.Server;
    
    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.routes();
    }
    
    routes(){
        this.app.use('/api',this.manageRouter);
    }
    
    public static get instance(){
        return this._instance || (this._instance = new this());
    }
    
    start(callback: Function){
        this.httpServer.listen(this.port, callback);
    }
}