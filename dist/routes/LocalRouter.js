"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomRouter_1 = require("../models/CustomRouter");
const Authentication_1 = require("../middlewares/Authentication");
const Local_1 = require("../models/Local");
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
        };
        this.getLocalById = (req, res) => {
        };
        //solo lo puede eliminar el dueño
        this.deleteLocal = (req, res) => {
        };
        //solo lo puede actualizar el dueño
        this.updateLocal = (req, res) => {
        };
        //solo lo puede actualizar el dueño
        this.addTobaccoToLocal = (req, res) => {
        };
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get('/', Authentication_1.verifyJwt, this.getMyLocals);
    }
}
exports.LocalRouter = LocalRouter;
//# sourceMappingURL=LocalRouter.js.map