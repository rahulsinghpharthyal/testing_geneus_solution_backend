import express from "express";
import {addtoCart, getCart, cartDelete} from "../controllers/CartController.js"
const router = express.Router();

import { Auth } from "../controllers/AuthController.js";

router.route('/cart').get(Auth, getCart).post(Auth, addtoCart).delete(Auth, cartDelete)

router.get("/cart",Auth, getCart);


export default router;