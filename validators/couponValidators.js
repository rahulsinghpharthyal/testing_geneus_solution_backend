export const validateCouponInput = (data) => {
  const errors = [];

  if (!data.code || typeof data.code !== 'string') {
    errors.push('Coupon code is required and must be a string.');
  }

  if (!['flat', 'percentage'].includes(data.discount_type)) {
    errors.push('Discount type must be "flat" or "percentage".');
  }

  if (typeof data.discount_value !== 'number' || data.discount_value < 0) {
    errors.push('Discount value must be a positive number.');
  }

  if (!data.valid_from || !data.valid_until) {
    errors.push('Valid from and until dates are required.');
  } else if (new Date(data.valid_until) <= new Date(data.valid_from)) {
    errors.push('valid_until must be after valid_from.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
