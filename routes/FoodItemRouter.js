import express from 'express';
const router = express.Router();
import {getItems, createItem} from "../controllers/FoodItemController.js"
import {AdminAuth, Auth} from '../controllers/AuthController.js'
router.get('/getFoodItems', getItems);
router.post('/addFoodItem',Auth, AdminAuth, createItem)
export default router;