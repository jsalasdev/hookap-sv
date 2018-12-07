"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const Authentication_1 = require("../middlewares/Authentication");
const User_1 = require("../models/User");
const _ = require('underscore');
class UserRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.getFavoriteLocal = (req, res) => {
            let user = req.user;
            User_1.User.findById(user._id, { favoriteLocals: 1 }, (err, user) => {
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
                    user
                });
            });
        };
        this.addFavoriteLocal = (req, res) => {
        };
        //testear esta api
        this.deleteFavoriteLocal = (req, res) => {
            let user = req.user;
            let idLocal = req.params.id_local;
            if (idLocal) {
                User_1.User.findById(user._id, { favoriteLocals: 1 }, (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: 'SERVER ERROR.'
                            }
                        });
                    }
                    let local = user.favoriteLocals.find(aux => aux == idLocal);
                    res.json({
                        res: local
                    });
                });
            }
            else {
                return res.json({
                    ok: false,
                    error: {
                        message: "Id local expected."
                    }
                });
            }
        };
        this.addHookahCounter = (req, res) => {
            let user = req.user;
            if (user !== undefined) {
                User_1.User.findById(user._id, (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: 'SERVER ERROR.'
                            }
                        });
                    }
                    else {
                        user.hookahCounter++;
                        User_1.User.updateOne(user, (err, u) => {
                            res.status(200).json({
                                ok: true,
                                error: {
                                    ok: true,
                                    user
                                }
                            });
                        });
                    }
                });
            }
        };
        this.deleteHookahCounter = (req, res) => {
            let user = req.user;
            if (user !== undefined) {
                User_1.User.findById(user._id, (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: {
                                message: 'SERVER ERROR.'
                            }
                        });
                    }
                    else {
                        if (user.hookahCounter > 0) {
                            user.hookahCounter--;
                            User_1.User.updateOne(user, (err, u) => {
                                res.status(200).json({
                                    ok: true,
                                    error: {
                                        ok: true,
                                        user
                                    }
                                });
                            });
                        }
                        else {
                            res.status(200).json({
                                ok: true,
                                error: {
                                    ok: true,
                                    user
                                }
                            });
                        }
                    }
                });
            }
        };
        this.updateProfile = (req, res) => {
            let user = req.user;
            let body = _.pick(req.body, ['userType']);
            User_1.User.findByIdAndUpdate(user._id, body, { new: true, runValidators: true }, (err, updatedUser) => {
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
                    user: updatedUser
                });
            });
        };
        this.getUserById = (req, res) => {
            let id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'User id expected.'
                    }
                });
            }
            User_1.User.findById(id)
                .exec((err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'User not found.'
                        }
                    });
                }
                res.json({
                    ok: true,
                    user
                });
            });
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get('/favorite-locals', Authentication_1.verifyJwt, this.getFavoriteLocal);
        this.router.delete('/favorite-locals', Authentication_1.verifyJwt, this.deleteFavoriteLocal);
        this.router.get('/:id', Authentication_1.verifyJwt, this.getUserById);
        this.router.post('/hookah/counter', Authentication_1.verifyJwt, this.addHookahCounter);
        this.router.delete('/hookah/counter', Authentication_1.verifyJwt, this.deleteHookahCounter);
        this.router.put('/', Authentication_1.verifyJwt, this.updateProfile);
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=UserRouter.js.map