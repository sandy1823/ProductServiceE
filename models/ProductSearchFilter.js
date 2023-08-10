const { default: axios } = require('axios');
const moment = require('moment');

module.exports = class ProductSearchFilter {
	constructor(filter) {
		this.priceRange = filter?.priceRange
			? {
					from:
						filter?.priceRange?.from &&
						filter.priceRange.from !== null
							? filter.priceRange.from
							: 1,
					to:
						filter?.priceRange?.to && filter.priceRange.to !== null
							? filter.priceRange.to
							: null,
			  }
			: null;

		this.inStock = filter?.inStock;
		this.newArrivalsFilter = filter?.newArrivalsFilter
			? {
					from: new Date(),
					to: moment()
						.subtract(filter.newArrivalsFilter, 'd')
						.toDate(),
			  }
			: {
					from: new Date(),
			  };
		this.withDeal = filter?.withDeal;
	}
};
