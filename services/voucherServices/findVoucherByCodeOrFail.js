import Voucher from "../../models/Voucher.js";
import ApiError from "../../utilities/ApiError.js";

export const findVoucherByCodeOrFail = async (code) => {
    console.log('this is code', code);
  const voucher = await Voucher.findOne({ code }).populate("coupon_id");

  if (!voucher) throw new ApiError(404, "Voucher not found");
  if (!voucher.is_active) throw new ApiError(400, "Voucher is not active");
  if (voucher.expires_at && new Date() > voucher.expires_at) {
    throw new ApiError(400, "Voucher has expired");
  }

  return voucher;
};
