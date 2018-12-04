import { CustomRouter } from '../models/CustomRouter';
import { Request, Response } from 'express';
import { FACEBOOK_ENDPOINT_VERIFY } from '../config/Environment';
import * as axios from 'axios';
import { Resolver } from 'dns';

export class AuthRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        // this.router.get('/', this.authWithFacebook);
        this.router.post('/', this.authWithFacebook);
    }
    
    authWithFacebook = (req: Request, res: Response) => {
        let body = req.body;

        if(body === undefined || (body.token === undefined || body.token === '')){
            return res.status(400).json({
                ok:false,
                error: 'Incorrect access token'
            });
        }else{
            let accessToken = body.token;
            const URL = FACEBOOK_ENDPOINT_VERIFY + accessToken;
            axios.default.get(URL)
            .then(res => {
                console.log(res);

                //continue user manage....

            })
            .catch(err => {
                res.status(500).json({
                    ok:false,
                    error: 'Server error'
                })
            });
        }

    }
    
}