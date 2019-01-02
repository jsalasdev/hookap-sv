import { CustomRouter } from "../models/CustomRouter";
import { verifyJwt } from '../middlewares/Authentication';
import { LocalDocument, Local } from '../models/Local';
import { LocalReviewDocument, LocalReview } from '../models/LocalReview';
import { UserDocument, User } from '../models/User';
import { getAddress } from '../utils/AddressUtil';
import { Tobacco } from '../models/Tobacco';
import { TobaccoBrand } from '../models/TobaccoBrand';
import { Model } from "mongoose";
import { LocalFollow, LocalFollowDocument } from '../models/LocalFollow';
import mongoose from 'mongoose';

const _ = require('underscore');

export class LocalRouter extends CustomRouter {
    
    constructor() {
        super();
        this.registerRoutes();
    }
    
    registerRoutes(){
        this.router.get('/locations', verifyJwt, this.getAllLocalsByLocation);
        this.router.get('/',verifyJwt, this.getMyLocals);
        this.router.post('/', verifyJwt, this.addLocal);
        this.router.get('/:id', verifyJwt, this.getLocalById);
        this.router.put('/:id', verifyJwt, this.updateLocal);
        this.router.delete('/:id', verifyJwt, this.deleteLocal);
        this.router.put('/:id/review', verifyJwt, this.putReview);
        this.router.put('/:id/follow', verifyJwt, this.putFollow);
        this.router.get('/:id/info', verifyJwt, this.getDataInfo);
    }
    
    
    getDataInfo = async(req:any, res: any) => {
        let idUser = req.user._id;
        let idLocal = req.params.id;
        if(idLocal && idUser){
            
            let localFollowInfo = await this.getLocalFollowInfo(idLocal, idUser);
            let localReviewInfo = await this.getLocalReviewInfo(idLocal, idUser);
            let localFollowers = await this.getLocalCountFollows(idLocal);
            let localReviews =await this.getLocalCountReviews(idLocal);
            let averageRating = await this.getLocalAverageRating(idLocal);
            
            console.log(averageRating);
            
            res.json({
                ok:true,
                info: {
                    local:{
                        _id: idLocal,
                        followers: localFollowers.valueOf(),
                        reviews: localReviews.valueOf(),
                        average: averageRating.length>0 ? averageRating[0].avgRating : 0
                    },
                    currentUser:{
                        follow: localFollowInfo,
                        review: localReviewInfo
                    }
                }
            });
        }else{
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Error consulta.'
                }
            });
        }
    }
    
    getLocalCountFollows = (idLocal:any) => {
        return LocalFollow.count({localId: idLocal}).exec();
    }
    
    getLocalCountReviews = (idLocal:any) => {
        return LocalReview.count({localId: idLocal})
        .exec();        
    }
    
    getLocalAverageRating = (idLocal:any) => {
        console.log(idLocal);
        return LocalReview
        .aggregate([
            {
                $match: { localId: new mongoose.Types.ObjectId(idLocal)}
            },
            {
                $group:
                {
                    _id: "$localId",
                    avgRating: { $avg: "$rating"}
                }
            }
        ])
        .exec();
    }
    
    getLocalFollowInfo = (idLocal:any, idUser:any) => {
        return LocalFollow.findOne({userId: idUser, localId: idLocal}).exec();
    }
    
    getLocalReviewInfo = (idLocal:any, idUser: any) => {
        return LocalReview.findOne({userId: idUser, localId: idLocal}).exec();
    }
    
    putReview = (req:any, res:any) => {
        let idUser = req.user._id;
        let rating = req.query.rating;
        let idLocal = req.params.id;
        console.log(`${idUser}  + ${rating} + ${idLocal}`);
        
        if(idUser && idLocal && rating && (rating >0 && rating <6)){
            LocalReview.findOne({ userId: idUser, localId: idLocal})
            .exec((err, review: LocalReviewDocument) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: err
                        }
                    });
                }                
                if(review){
                    review.rating = rating;
                    LocalReview.findOneAndUpdate(review._id, review, {new: true},(err:any, updatedReview:any) =>{
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    message: err
                                }
                            });
                        }
                        return res.json({
                            ok: true,
                            updatedReview
                        });
                    });                    
                }else{
                    let review = new LocalReview( {
                        userId: idUser,
                        localId: idLocal,
                        rating: rating
                    });
                    review.save((err: any, review:LocalReviewDocument) => {
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
                            review
                        });
                    });
                }
            });
        }else{
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Error consulta.'
                }
            });
        }
    }
    
    putFollow = (req:any, res:any) => {
        let idUser = req.user._id;
        let idLocal = req.params.id;
        if(idUser && idLocal){
            LocalFollow.findOne({userId: idUser, localId: idLocal})
            .exec((err, follow: LocalFollowDocument) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: err
                        }
                    });
                }
                
                User.findOne({_id: idUser}).exec((err:any, user: UserDocument)=> {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: err
                            }
                        });
                    }
                    
                    if(follow){
                        let index = user.favoriteLocals.indexOf(idLocal,0);
                        if(index > -1){
                            user.favoriteLocals.splice(index,1);
                            User.findOneAndUpdate(idUser,user, {new:true}, (err:any, updatedUser:any) => {
                                if(err){
                                    return res.status(500).json({
                                        ok: false,
                                        error: {
                                            message: err
                                        }
                                    });
                                }
                                
                                return LocalFollow.findOneAndDelete({userId: idUser, localId: idLocal})
                                .exec((err, follow: LocalFollowDocument) => {
                                    if(err){
                                        return res.status(500).json({
                                            ok: false,
                                            error: {
                                                message: err
                                            }
                                        });
                                    }
                                    return res.json({
                                        ok: true,
                                        follow
                                    });
                                });
                            });
                        }else{
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    message: err
                                }
                            });
                        }
                    }else{
                        user.favoriteLocals.push(idLocal);
                        User.findOneAndUpdate(idUser,user, {new:true}, (err:any, updatedUser:any) => {
                            if(err){
                                return res.status(500).json({
                                    ok: false,
                                    error: {
                                        message: err
                                    }
                                });
                            }
                            let follow = new LocalFollow({
                                userId: idUser,
                                localId: idLocal
                            });
                            follow.save((err: any, follow:LocalFollowDocument) => {
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
                                    follow
                                });
                            }); 
                        });
                    }                        
                });    
            });
        }else{
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Error consulta.'
                }
            });
        }
    }
    
    getMyLocals = async(req: any, res:any) => {
        let user: UserDocument = req.user;
        if(req.query.type){
            switch (req.query.type) {
                case 'my-locals':
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
                break;
                case 'top-followers':
                
                let aggregatorOpts = [
                    {$group: {
                        _id: "$localId",
                        follows: { $sum: 1 }
                    }}
                    // ,
                    // { $lookup: {
                    //     from: 'locals',
                    //     localField: 'localId',
                    //     foreignField: '_id',
                    //     as: 'detail'
                    // }}
                    // ,
                    // {
                    //     $match:{
                    //         local: {$ne:[]}
                    //     }
                    // }
                ];
                let infoFollows = await LocalFollow.aggregate(aggregatorOpts)
                .sort({follows: 'desc'})
                .limit(5)
                .exec();
                if(infoFollows && infoFollows.length>0){
                    let locals: any[] = [];
                    for(let aux of infoFollows){
                        console.log(aux);
                        let local:any = await Local.findById(aux._id).exec();
                        let response = {
                            follows: aux.follows,
                            local
                        }
                        locals.push(response);
                    }
                    res.json({
                        ok: true,
                        locals
                    });
                }else{
                    res.json({
                        ok:true,
                        locals: new Array(0)
                    })
                }
                
                break;
                case 'latests':
                Local.find({status: 'ACCEPTED'})
                .limit(10)
                .sort('-createdAt')
                .exec((err, locals: LocalDocument[]) => {
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
                        locals
                    });
                }); 
                break;
                default:
                return res.status(400).json({
                    ok:false,
                    error: {
                        message: 'Error consulta.'
                    }
                });
            }
        }else{
            return res.status(400).json({
                ok:false,
                error: {
                    message: 'Error consulta.'
                }
            });
        }
        
        
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
            localSpace: body.localSpace,
            hasAirConditioner: body.hasAir,
            hasSoccer: body.hasSoccer,
            hasMusic:body.hasMusic,
            location: {
                description: body.location.description,
                type: 'Point',
                coordinates: [body.location.coordinates[0],body.location.coordinates[1]]
            }
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
    
    getAllLocalsByLocation = (req:any, res:any) => {
        
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        let radius = req.query.radius;
        
        if(latitude && longitude && radius){
            Local.find({
                $and: [{
                    "location": {
                        "$geoWithin": {
                            "$center": [[latitude, longitude] ,Number(radius)/6378.1]
                        }
                    }
                },{
                    "status": "ACCEPTED"
                }
            ]})
            // .populate({ path:'tobaccos', model: Tobacco, populate: { path: 'brand', Model: TobaccoBrand, select: 'name isPremium'}})
            .exec((err, locals) =>{
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
                    locals
                })
            });
        }else{
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Inserta los parámetros esperados'
                }
            });        
        }
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
        .populate({ path:'tobaccos', model: Tobacco, populate: { path: 'brand', Model: TobaccoBrand, select: 'name isPremium'}})
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