import mongoose from "mongoose";

const NutriSubscriptionPaymentDetailSchema = mongoose.Schema(
    {
      order_id: String,
      payment_id: String,
      signature: String,
      status: String,
      user_id: String,
    },
    { timestamps: true }
  );

  const NutriAppPaymentDetail = mongoose.model("NutriAppPayment", NutriSubscriptionPaymentDetailSchema);

    export default NutriAppPaymentDetail;