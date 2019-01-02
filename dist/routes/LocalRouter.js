"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const Authentication_1 = require("../middlewares/Authentication");
const Local_1 = require("../models/Local");
const LocalReview_1 = require("../models/LocalReview");
const User_1 = require("../models/User");
const Tobacco_1 = require("../models/Tobacco");
const TobaccoBrand_1 = require("../models/TobaccoBrand");
const LocalFollow_1 = require("../models/LocalFollow");
const mongoose_1 = __importDefault(require("mongoose"));
const _ = require('underscore');
class LocalRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.getDataInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let idUser = req.user._id;
            let idLocal = req.params.id;
            if (idLocal && idUser) {
                let localFollowInfo = yield this.getLocalFollowInfo(idLocal, idUser);
                let localReviewInfo = yield this.getLocalReviewInfo(idLocal, idUser);
                let localFollowers = yield this.getLocalCountFollows(idLocal);
                let localReviews = yield this.getLocalCountReviews(idLocal);
                let averageRating = yield this.getLocalAverageRating(idLocal);
                console.log(averageRating);
                res.json({
                    ok: true,
                    info: {
                        local: {
                            _id: idLocal,
                            followers: localFollowers.valueOf(),
                            reviews: localReviews.valueOf(),
                            average: averageRating.length > 0 ? averageRating[0].avgRating : 0
                        },
                        currentUser: {
                            follow: localFollowInfo,
                            review: localReviewInfo
                        }
                    }
                });
            }
            else {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Error consulta.'
                    }
                });
            }
        });
        this.getLocalCountFollows = (idLocal) => {
            return LocalFollow_1.LocalFollow.count({ localId: idLocal }).exec();
        };
        this.getLocalCountReviews = (idLocal) => {
            return LocalReview_1.LocalReview.count({ localId: idLocal })
                .exec();
        };
        this.getLocalAverageRating = (idLocal) => {
            console.log(idLocal);
            return LocalReview_1.LocalReview
                .aggregate([
                {
                    $match: { localId: new mongoose_1.default.Types.ObjectId(idLocal) }
                },
                {
                    $group: {
                        _id: "$localId",
                        avgRating: { $avg: "$rating" }
                    }
                }
            ])
                .exec();
        };
        this.getLocalFollowInfo = (idLocal, idUser) => {
            return LocalFollow_1.LocalFollow.findOne({ userId: idUser, localId: idLocal }).exec();
        };
        this.getLocalReviewInfo = (idLocal, idUser) => {
            return LocalReview_1.LocalReview.findOne({ userId: idUser, localId: idLocal }).exec();
        };
        this.putReview = (req, res) => {
            let idUser = req.user._id;
            let rating = req.query.rating;
            let idLocal = req.params.id;
            console.log(`${idUser}  + ${rating} + ${idLocal}`);
            if (idUser && idLocal && rating && (rating > 0 && rating < 6)) {
                LocalReview_1.LocalReview.findOne({ userId: idUser, localId: idLocal })
                    .exec((err, review) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: err
                            }
                        });
                    }
                    if (review) {
                        review.rating = rating;
                        LocalReview_1.LocalReview.findOneAndUpdate(review._id, review, { new: true }, (err, updatedReview) => {
                            if (err) {
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
                    }
                    else {
                        let review = new LocalReview_1.LocalReview({
                            userId: idUser,
                            localId: idLocal,
                            rating: rating
                        });
                        review.save((err, review) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    error: {
                                        message: err
                                    }
                                });
                            }
                            ;
                            return res.json({
                                ok: true,
                                review
                            });
                        });
                    }
                });
            }
            else {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Error consulta.'
                    }
                });
            }
        };
        this.putFollow = (req, res) => {
            let idUser = req.user._id;
            let idLocal = req.params.id;
            if (idUser && idLocal) {
                LocalFollow_1.LocalFollow.findOne({ userId: idUser, localId: idLocal })
                    .exec((err, follow) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: err
                            }
                        });
                    }
                    User_1.User.findOne({ _id: idUser }).exec((err, user) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    message: err
                                }
                            });
                        }
                        if (follow) {
                            let index = user.favoriteLocals.indexOf(idLocal, 0);
                            if (index > -1) {
                                user.favoriteLocals.splice(index, 1);
                                User_1.User.findOneAndUpdate(idUser, user, { new: true }, (err, updatedUser) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            error: {
                                                message: err
                                            }
                                        });
                                    }
                                    return LocalFollow_1.LocalFollow.findOneAndDelete({ userId: idUser, localId: idLocal })
                                        .exec((err, follow) => {
                                        if (err) {
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
                            }
                            else {
                                return res.status(500).json({
                                    ok: false,
                                    error: {
                                        message: err
                                    }
                                });
                            }
                        }
                        else {
                            user.favoriteLocals.push(idLocal);
                            User_1.User.findOneAndUpdate(idUser, user, { new: true }, (err, updatedUser) => {
                                if (err) {
                                    return res.status(500).json({
                                        ok: false,
                                        error: {
                                            message: err
                                        }
                                    });
                                }
                                let follow = new LocalFollow_1.LocalFollow({
                                    userId: idUser,
                                    localId: idLocal
                                });
                                follow.save((err, follow) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            error: {
                                                message: err
                                            }
                                        });
                                    }
                                    ;
                                    return res.json({
                                        ok: true,
                                        follow
                                    });
                                });
                            });
                        }
                    });
                });
            }
            else {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Error consulta.'
                    }
                });
            }
        };
        this.getMyLocals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let user = req.user;
            if (req.query.type) {
                switch (req.query.type) {
                    case 'my-locals':
                        Local_1.Local.find({ userOwner: user._id }, (err, locals) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
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
                            { $group: {
                                    _id: "$localId",
                                    follows: { $sum: 1 }
                                } }
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
                        let infoFollows = yield LocalFollow_1.LocalFollow.aggregate(aggregatorOpts)
                            .sort({ follows: 'desc' })
                            .limit(5)
                            .exec();
                        if (infoFollows && infoFollows.length > 0) {
                            let locals = [];
                            for (let aux of infoFollows) {
                                console.log(aux);
                                let local = yield Local_1.Local.findById(aux._id).exec();
                                let response = {
                                    follows: aux.follows,
                                    local
                                };
                                locals.push(response);
                            }
                            res.json({
                                ok: true,
                                locals
                            });
                        }
                        else {
                            res.json({
                                ok: true,
                                locals: new Array(0)
                            });
                        }
                        break;
                    case 'latests':
                        Local_1.Local.find({ status: 'ACCEPTED' })
                            .limit(10)
                            .sort('-createdAt')
                            .exec((err, locals) => {
                            console.log(err);
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
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
                            ok: false,
                            error: {
                                message: 'Error consulta.'
                            }
                        });
                }
            }
            else {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Error consulta.'
                    }
                });
            }
        });
        this.addLocal = (req, res) => {
            let user = req.user;
            let body = req.body;
            console.log(body);
            let local = new Local_1.Local({
                name: body.name,
                availableHookahs: body.availableHookahs,
                userOwner: user._id,
                premiumTobaccoPrice: body.premiumTobaccoPrice,
                tobaccoPrice: body.tobaccoPrice,
                tobaccos: body.tobaccos,
                localSpace: body.localSpace,
                hasAirConditioner: body.hasAir,
                hasSoccer: body.hasSoccer,
                hasMusic: body.hasMusic,
                location: {
                    description: body.location.description,
                    type: 'Point',
                    coordinates: [body.location.coordinates[0], body.location.coordinates[1]]
                }
            });
            local.save((err, local) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: err
                        }
                    });
                }
                ;
                return res.json({
                    ok: true,
                    local
                });
            });
        };
        this.getAllLocalsByLocation = (req, res) => {
            let latitude = req.query.latitude;
            let longitude = req.query.longitude;
            let radius = req.query.radius;
            if (latitude && longitude && radius) {
                Local_1.Local.find({
                    $and: [{
                            "location": {
                                "$geoWithin": {
                                    "$center": [[latitude, longitude], Number(radius) / 6378.1]
                                }
                            }
                        }, {
                            "status": "ACCEPTED"
                        }
                    ]
                })
                    // .populate({ path:'tobaccos', model: Tobacco, populate: { path: 'brand', Model: TobaccoBrand, select: 'name isPremium'}})
                    .exec((err, locals) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            ok: false,
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
            else {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Inserta los parámetros esperados'
                    }
                });
            }
        };
        this.getLocalById = (req, res) => {
            let id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Local id expected.'
                    }
                });
            }
            Local_1.Local.findById(id)
                .populate({ path: 'tobaccos', model: Tobacco_1.Tobacco, populate: { path: 'brand', Model: TobaccoBrand_1.TobaccoBrand, select: 'name isPremium' } })
                .exec((err, local) => {
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
        };
        //solo lo puede actualizar el dueño
        this.updateLocal = (req, res) => {
            let id = req.params.id;
            let user = req.user;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Local id expected.'
                    }
                });
            }
            Local_1.Local.findById(id)
                .exec((err, local) => {
                if (err || !local) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Local not found.'
                        }
                    });
                }
                else {
                    if (local && user._id == local.userOwner) {
                        Local_1.Local.findOneAndUpdate(id, req.body, { new: true }, (err, updatedLocal) => {
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
                                local: updatedLocal
                            });
                        });
                    }
                    else {
                        return res.status(403).json({
                            ok: false,
                            error: {
                                message: 'Not permissions'
                            }
                        });
                    }
                }
            });
        };
        //solo lo puede eliminar el dueño
        this.deleteLocal = (req, res) => {
            let id = req.params.id;
            let user = req.user;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Local id expected.'
                    }
                });
            }
            Local_1.Local.findById(id, (err, local) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: 'SERVER ERROR.'
                        }
                    });
                }
                if (local && user._id == local.userOwner) {
                    Local_1.Local.deleteOne({ _id: id }, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                error: {
                                    message: 'SERVER ERROR.'
                                }
                            });
                        }
                        res.status(200).json({
                            ok: true,
                            local
                        });
                    });
                }
                else {
                    return res.status(403).json({
                        ok: false,
                        error: {
                            message: 'Not permissions'
                        }
                    });
                }
            });
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get('/locations', Authentication_1.verifyJwt, this.getAllLocalsByLocation);
        this.router.get('/', Authentication_1.verifyJwt, this.getMyLocals);
        this.router.post('/', Authentication_1.verifyJwt, this.addLocal);
        this.router.get('/:id', Authentication_1.verifyJwt, this.getLocalById);
        this.router.put('/:id', Authentication_1.verifyJwt, this.updateLocal);
        this.router.delete('/:id', Authentication_1.verifyJwt, this.deleteLocal);
        this.router.put('/:id/review', Authentication_1.verifyJwt, this.putReview);
        this.router.put('/:id/follow', Authentication_1.verifyJwt, this.putFollow);
        this.router.get('/:id/info', Authentication_1.verifyJwt, this.getDataInfo);
    }
}
exports.LocalRouter = LocalRouter;
//# sourceMappingURL=LocalRouter.js.map