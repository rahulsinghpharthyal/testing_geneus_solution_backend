import { findCouponByIdOrFail } from "../couponServices/couponService.js";
import Voucher from '../../models/Voucher.js';

function generateRandomString(length = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const createVoucherService = async ({ coupon_id, user_ids = [], expires_at }) => {
  const coupon = await findCouponByIdOrFail(coupon_id); // find coupon and check validation

  const createdVouchers = [];

  if (user_ids.length > 0) {
    for (const userId of user_ids) {
      const code = `${coupon.code}-${userId.slice(-4)}-${generateRandomString(4)}`;
      const voucher = await Voucher.create({
        code,
        coupon_id,
        user_id: userId,
        expires_at,
        is_active: true
      });
      createdVouchers.push(voucher);
    }
  } else {
    const code = `${coupon.code}-GENEUS-${generateRandomString(6)}`;
    const voucher = await Voucher.create({
      code,
      coupon_id,
      user_id: null,
      expires_at,
      is_active: true
    });
    createdVouchers.push(voucher);
  }

  return createdVouchers;
};



