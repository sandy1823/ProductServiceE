var express = require('express');
var cartService = require('../services/cart_service');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	ADDTOCART,
	GETCART,
	REMOVEFROMCART,
	REMOVEALLFROMCART,
	UPDATECARTPRODUCTS,
	REMOVELISTOFPRODUCTFROMCART,
	CLEARCARTANDADDPRODUCT,
	GETCARTIDBYUSERID,
} = require('../utils/endpoints');

const router = express.Router();

router.get(GETCART, serviceHandler(cartService.getCartService));

router.get(
	GETCARTIDBYUSERID,
	serviceHandler(cartService.getCartIdByUserIdService)
);

router.use(checkUserMiddleware);

router.delete(
	REMOVEFROMCART,
	serviceHandler(cartService.removeCartProductService)
);

router.delete(
	REMOVELISTOFPRODUCTFROMCART,
	serviceHandler(cartService.removeCartProductsService)
);

router.post(
	ADDTOCART,
	cartService.checkForCartClientService,
	serviceHandler(cartService.addToCartService)
);

router.put(
	UPDATECARTPRODUCTS,
	cartService.validateListOfCartProductsService,
	serviceHandler(cartService.updateCartProductsService)
);

router.delete(
	REMOVEALLFROMCART,
	serviceHandler(cartService.removeAllCartProductService)
);

router.put(
	CLEARCARTANDADDPRODUCT,
	serviceHandler(cartService.clearAndAddCartProduct)
);

module.exports = router;
