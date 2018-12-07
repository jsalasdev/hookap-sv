import { CustomRouter } from '../models/CustomRouter';
import { Request, Response } from 'express';
import { FACEBOOK_ENDPOINT_VERIFY, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_ENDPOINT_DATA } from '../config/Environment';
import * as axios from 'axios';
import { UserDocument, User } from '../models/User';
import { generateToken } from '../middlewares/Authentication';

async function updateUserProfile(accessToken:string) {
    try{
        const response = await axios.default.get(FACEBOOK_ENDPOINT_DATA+accessToken);
        return response.data;
    }catch(err){
        return undefined;
    }
}

export class AuthRouter extends CustomRouter {
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.post('/', this.authWithFacebook);
    }
    
    //Modificar en el futuro: crear un verify para facebook y desacoplar logica de la ruta
    //Crear un base para los errores
    authWithFacebook = (req: Request, res: Response) => {
        let body = req.body;
        
        if(body === undefined || (body.access_token === undefined || body.access_token === '')){
            return res.status(400).json({
                ok:false,
                error: 'Incorrect access token'
            });
        }else{
            let tokenToInspect = body.access_token;
            const URL = `${FACEBOOK_ENDPOINT_VERIFY}input_token=${tokenToInspect}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
            axios.default.get(URL)
            .then(resp => {
                let userId:number = resp.data.data.user_id;
                User.findOne({ providerId: userId }, (err:any, user:UserDocument) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error:{
                                message: 'SERVER ERROR.'
                            }
                        });
                    }
                    if(!user){
                        updateUserProfile(tokenToInspect).then(data => {
                            let newUser = new User({
                                firstName: data.first_name,
                                lastName: data.last_name,
                                picture: data.picture.data.url,
                                providerId: userId,
                                provider: 'facebook'
                            });
                            newUser.save((err:any, userDB:UserDocument) => {
                                if (err) {
                                    return res.status(500).json({
                                        ok: false,
                                        error: {
                                            message: 'SERVER ERROR.'
                                        }
                                    });
                                };
                                console.log(userDB);
                                return res.json({
                                    ok: true,
                                    user: userDB,
                                    token: generateToken(userDB)
                                });
                            });
                        }).catch(err => {
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    message: 'SERVER ERROR.'
                                }
                            });
                        });
                    }else{
                            return res.json({
                                ok: true,
                                user,
                                token: generateToken(user)
                            });
                    }
                });
            })
            .catch(err => {
                if(err.response){
                    res.status(401).json({
                        ok:false,
                        error: err.response.data
                    });
                }else{
                    res.status(401).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }
            });
        }
    }
}