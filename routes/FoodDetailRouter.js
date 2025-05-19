import express from 'express';
const router = express.Router();

import { Auth } from '../controllers/AuthController.js'
import {postFood, getFoodById, updateFood, removeFood} from "../controllers/FoodController.js"
import { isNutriPlanValid } from '../middlewares/isNutriPlanValid.js';

router.post('/api/addFood',Auth,isNutriPlanValid,postFood);
router.get('/api/getFoodById/:id',Auth,getFoodById);
router.put('/api/updateFood', Auth,isNutriPlanValid, updateFood);
router.delete('/api/removeFood',Auth,isNutriPlanValid, removeFood)

export default router;