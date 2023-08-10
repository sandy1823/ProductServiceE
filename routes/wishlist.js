var express = require('express');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	validateWishlist,
	handleValidation,
} = require('../services/validator_service');
var wishlistService = require('../services/wishlist_service');
const {
	ADDTOWISHLIST,
	REMOVEFROMWISHLIST,
	GETWISHLIST,
	REMOVEALLFROMWISHLIST,
	GETWISHLISTALLWISHLISTSBYUSERID,
	GETALLWISHLISTLISTNAMES,
	REMOVEALLWISHLISTSBYUSERID,
	CREATEWISHLIST,
	DELETEWISHLIST,
	UPDATEWISHLIST,
	CREATEWISHLISTANDADDPRODUCT,
} = require('../utils/endpoints');

const router = express.Router();

router.get(GETWISHLIST, serviceHandler(wishlistService.getWishlistService));

router.get(
	GETWISHLISTALLWISHLISTSBYUSERID,
	serviceHandler(wishlistService.getAllWishlistsByUserIdService)
);

router.get(
	GETALLWISHLISTLISTNAMES,
	serviceHandler(wishlistService.getAllWishlistListNamesByUserIdService)
);

router.use(checkUserMiddleware);

router.delete(
	REMOVEFROMWISHLIST,
	serviceHandler(wishlistService.removeWishlistProductService)
);

router.delete(
	REMOVEALLFROMWISHLIST,
	serviceHandler(wishlistService.removeAllWishlistProductService)
);

router.post(
	ADDTOWISHLIST,
	serviceHandler(wishlistService.addToWishlistService)
);

router.post(
	CREATEWISHLISTANDADDPRODUCT,
	serviceHandler(wishlistService.createWishlistAndAddProductService)
);

router.delete(
	REMOVEALLWISHLISTSBYUSERID,
	serviceHandler(wishlistService.removeAllWishlistByUserIdService)
);

router.post(
	CREATEWISHLIST,
	validateWishlist(),
	handleValidation(),
	serviceHandler(wishlistService.createWishlistService)
);

router.put(
	UPDATEWISHLIST,
	validateWishlist(),
	handleValidation(),
	serviceHandler(wishlistService.updateWishlistService)
);

router.delete(
	DELETEWISHLIST,
	serviceHandler(wishlistService.deleteWishlistService)
);
module.exports = router;
