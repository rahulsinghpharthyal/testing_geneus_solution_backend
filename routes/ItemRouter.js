import express from 'express';
import { createItem, getItems } from '../controllers/ItemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/api/item', getItems);

export default router;
