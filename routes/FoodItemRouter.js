import express from 'express';
const router = express.Router();
import {getItems, createItem} from "../controllers/FoodItemController.js"
import {Auth} from '../controllers/AuthController.js'

import { Authorise } from '../middlewares/authorize.js';

router.get('/getFoodItems', getItems);
router.post('/addFoodItem',Auth, Authorise(['admin']), createItem)
export default router;