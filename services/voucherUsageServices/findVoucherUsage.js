import Voucher from "../../models/Voucher.js";
import VoucherUsage from "../../models/VoucherUsage.js"
import ApiError from "../../utilities/ApiError.js";

export const findVoucherUsage =  async (user_id, code) => {
const alreadyUsed = await VoucherUsage.findOne({ userId: user_id, couponCode: code });

  if (alreadyUsed) {
    throw new ApiError(400, "You have already used this voucher.");
  }

  return alreadyUsed;
}

export const handleVoucherPostPayment = async (userId, voucherToken) => {
  const { voucherId } = voucherToken;
  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  const usageCount = await VoucherUsage.countDocuments({
    userId: userId,
    couponCode: voucher.code,
  });

  if (usageCount >= voucher.user_limit) {
    throw new ApiError(400, "Voucher usage limit exceeded for this user");
  }

  await VoucherUsage.create({
    userId,
    couponCode: voucher.code,
    courseId: null,
    usedOn: new Date(),
  });

  voucher.usage_count += 1;
  await voucher.save();
};
