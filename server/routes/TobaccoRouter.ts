import { CustomRouter } from "../models/CustomRouter";
import { Request, Response } from 'express';
import { verifyJwt } from '../middlewares/Authentication';
import { TobaccoBrand } from '../models/TobaccoBrand';
import { Tobacco } from '../models/Tobacco';

export class TobaccoRouter extends CustomRouter {
    
    constructor(){
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/', verifyJwt, this.getTobaccos);
        this.router.get('/brands', verifyJwt, this.getTobaccoBrands);
    }
    
    //get brands
    
    getTobaccos = (req:any, res:any) => {
        Tobacco.find()
        .populate('brand', '_id name isPremium')
        .exec((err, tobaccos) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    ok:false,
                    error: {
                        message: 'SERVER ERROR.'
                    }
                });
            }
            res.json({
                ok: true,
                tobaccos
            });
        });
    }
    
    getTobaccoBrands = (req:any, res:any) => {
        let id = req.query.id;
        
        if(id){
            TobaccoBrand.findById(id)
            .populate({ path:'tobaccos', model: Tobacco})
            .exec((err, brands) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }
                res.json({
                    ok: true,
                    brands
                });
            });
        }else{
            TobaccoBrand.find()
            .exec((err, brands) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        ok:false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }
                res.json({
                    ok: true,
                    brands
                });
            });
            
        }
        
    }
    
    //tobaccos by brand
    
    //list all tobacco
    
    
    
}