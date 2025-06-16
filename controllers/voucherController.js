import ApiError from "../utilities/ApiError.js";
import { findUsersByEmailsOrFail } from "../services/userServices/userService.js";
import { createVoucherService } from "../services/voucherServices/voucherService.js";
import ApiResponse from "../utilities/ApiResponse.js";
import catchAsync from "../utilities/catchAsync.js";
import { verifyVoucherService } from "../services/voucherServices/applyVoucherService.js";
import { findVoucherUsage } from "../services/voucherUsageServices/findVoucherUsage.js";
import { couponIsValidOrFail } from "../services/couponServices/couponIsValidOrFails.js";

export const createVoucherController = catchAsync(async (req, res) => {
  const {
    coupon_id,
    user_emails = [],
    distributeToAll = false,
    expires_at,
  } = req.body;

  await couponIsValidOrFail(coupon_id);

   let finalUserIds = [];

  if (distributeToAll) {
    const allUsers = await findUsersByEmailsOrFail(user_emails); // or use a User.find() call
    finalUserIds = allUsers.map(u => u._id.toString());
  } else if (Array.isArray(user_emails) && user_emails.length > 0) {
    const users = await findUsersByEmailsOrFail(user_emails);
    finalUserIds = users.map(u => u._id.toString());
  }

  const vouchers = await createVoucherService({
    coupon_id,
    user_ids: finalUserIds,
    expires_at,
  });

  if (!vouchers || vouchers.length === 0) {
    throw new ApiError(500, "No vouchers were created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, vouchers, "Voucher(s) Created"));
});


export const applyVoucherService = catchAsync(async(req, res) => {
  const {code, cartAmount, course_id} = req.body;
  console.log('this is appyVoucher', req.body)
  const user_id = req.user?.userId;
  if(!code || !cartAmount){
   throw new ApiError(400, "Voucher code and amount are required!")
  }
  const alreadyUse = await findVoucherUsage(user_id, code);
  
  const result = await verifyVoucherService({ code, user_id, cartAmount, course_id });
  return res.status(200).json(new ApiResponse(200, result, "Coupon Applied Succesfully"))
})