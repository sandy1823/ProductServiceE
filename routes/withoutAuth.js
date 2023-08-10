var express = require('express');
const { serviceHandler } = require('../services/common_service');
var productService = require('../services/product_service');
const { UPDATEPRODUCTQTYONFAILEDCHECKOUT } = require('../utils/endpoints');

const router = express.Router();

router.put(
	UPDATEPRODUCTQTYONFAILEDCHECKOUT,
	serviceHandler(productService.updateProductQtyOnFailedCheckoutService)
);

module.exports = router;
