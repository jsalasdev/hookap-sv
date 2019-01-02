"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const Authentication_1 = require("../middlewares/Authentication");
const TobaccoBrand_1 = require("../models/TobaccoBrand");
const Tobacco_1 = require("../models/Tobacco");
class TobaccoRouter extends CustomRouter_1.CustomRouter {
    constructor() {
        super();
        //get brands
        this.getTobaccos = (req, res) => {
            Tobacco_1.Tobacco.find()
                .populate('brand', '_id name isPremium')
                .exec((err, tobaccos) => {
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
                    tobaccos
                });
            });
        };
        this.getTobaccoBrands = (req, res) => {
            let id = req.query.id;
            if (id) {
                TobaccoBrand_1.TobaccoBrand.findById(id)
                    .populate({ path: 'tobaccos', model: Tobacco_1.Tobacco })
                    .exec((err, brands) => {
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
                        brands
                    });
                });
            }
            else {
                TobaccoBrand_1.TobaccoBrand.find()
                    .exec((err, brands) => {
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
                        brands
                    });
                });
            }
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get('/', Authentication_1.verifyJwt, this.getTobaccos);
        this.router.get('/brands', Authentication_1.verifyJwt, this.getTobaccoBrands);
    }
}
exports.TobaccoRouter = TobaccoRouter;
//# sourceMappingURL=TobaccoRouter.js.map