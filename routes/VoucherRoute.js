import {Router}  from 'express';
import { applyVoucherService, createVoucherController } from '../controllers/voucherController.js';
import { Auth } from '../controllers/AuthController.js';
import { Authorise } from '../middlewares/authorize.js';

const router = Router();

router.post('/create-voucher',Auth, Authorise(['admin']), createVoucherController);
router.post('/apply-voucher', Auth, applyVoucherService);
export default router;