class GetAllProductsWithoutDealResponse {
	constructor(productData) {
		this.productId = productData.productId;
		this.productName = productData.productName;
	}
}

module.exports = { GetAllProductsWithoutDealResponse };
