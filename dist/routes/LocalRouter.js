"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const Authentication_1 = require("../middlewares/Authentication");
const Local_1 = require("../models/Local");
const AddressUtil_1 = require("../utils/AddressUtil");
const _ = require('underscore');
class LocalRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        this.getMyLocals = (req, res) => {
            let user = req.user;
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
        };
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
                location: {
                    description: body.location.description,
                    type: 'Point',
                    coordinates: [body.location.latLng.lat, body.location.latLng.lng]
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
                let address = AddressUtil_1.getAddress(latitude, longitude, radius);
                console.log(address);
                Local_1.Local.find({
                    $and: [{
                            "location": {
                                "$geoWithin": {
                                    "$center": [[latitude, longitude], 300 / 6378.1]
                                }
                            }
                        }, {
                            "status": "ACCEPTED"
                        }
                    ]
                }).exec((err, locals) => {
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
    }
}
exports.LocalRouter = LocalRouter;
//# sourceMappingURL=LocalRouter.js.map