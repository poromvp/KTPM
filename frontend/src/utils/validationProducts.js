// Validation cho sản phẩm - hàm duy nhất validate tất cả fields
export const validateProduct = (product) => {
  const errors = {};

  // Validate name
  if (!product.name) {
    errors.name = "Tên sản phẩm là bắt buộc, không được để trống";
  } else if (product.name.trim().length < 3) {
    errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
  } else if (product.name.length > 100) {
    errors.name = "Tên sản phẩm không được vượt quá 100 ký tự";
  }

  // Validate price
  if (product.price === undefined || product.price === null || product.price === '') {
    errors.price = "Giá là bắt buộc";
  } else {
    const priceNum = parseFloat(product.price);
    if (isNaN(priceNum)) {
      errors.price = "Giá phải là số";
    } else if (priceNum < 0) {
      errors.price = "Giá không được là số âm";
    } else if (priceNum > 1000000000) {
      errors.price = "Giá không được vượt quá 1 tỷ";
    }
  }

  // Validate quantity
  if (product.quantity === undefined || product.quantity === null || product.quantity === '') {
    errors.quantity = "Số lượng là bắt buộc";
  } else {
    const quantityNum = parseInt(product.quantity);
    if (isNaN(quantityNum)) {
      errors.quantity = "Số lượng phải là số nguyên";
    } else if (!Number.isInteger(parseFloat(product.quantity))) {
      errors.quantity = "Số lượng phải là số nguyên";
    } else if (quantityNum < 0) {
      errors.quantity = "Số lượng không được là số âm";
    } else if (quantityNum > 1000000) {
      errors.quantity = "Số lượng không được vượt quá 1 triệu";
    }
  }

  // Validate category
  if (!product.category) {
    errors.category = "Danh mục là bắt buộc";
  } else {
    const validCategories = [
      "iphone",
      "ipad",
      "macbook",
      "imac",
      "airpod",
      "airmax",
      "applewatch",
    ];
    if (!validCategories.includes(product.category)) {
      errors.category = "Danh mục không hợp lệ";
    }
  }

  // Return null nếu không có lỗi, ngược lại return object errors
  return Object.keys(errors).length > 0 ? errors : null;
};
