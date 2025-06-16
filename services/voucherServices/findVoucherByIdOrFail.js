import Voucher from "../../models/Voucher.js";

export const findVoucherByIdOrFail = async (id) => {
    console.log('this is code', id);
  const voucher = await Voucher.findOne({_id: id});

  if (!voucher) throw new ApiError(404, "Voucher not found");
  if (!voucher.is_active) throw new ApiError(400, "Voucher is not active");
  if (voucher.expires_at && new Date() > voucher.expires_at) {
    throw new ApiError(400, "Voucher has expired");
  }

  return voucher;
};
