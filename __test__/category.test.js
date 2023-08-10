const request = require(`supertest`);
const mongoose = require('mongoose');
const app = require(`../app`);
var endpoints = require('../utils/endpoints');

afterAll(async () => {
	await mongoose.disconnect();
});

const data = {
	CLIENT_ID: `C124`,
	VALID_PRODUCT_DETAILS:{
		clientId: "123",
		productId: "productId,
		productName: "productName,
		productDesc: "productDesc,
		categoryId: "categoryId,
		price: "price,
		Minimum_Advertisable_price: "minimum_Advertisable_price,
		priceCategory: "priceCategory,
		productType: "productType,
		discount: "discount,
		taxClass: "taxClass,
		supplier: "supplier,
		leadtime: "leadtime,
		qtyAvailable: "qtyAvailable,
		attributesets: "attributesets,
		createdBy: "createdBy,
		visibilityStatus: "visibilityStatus,
		newTag: {
			fromDate: new Date("newTag.fromDate),
			toDate: new Date("newTag.toDate),
		}
		},
	INVALID_PRODUCT_DETAILS: {},
	PRODUCTID_TO_DELETE: `P201`,
	VALID_PRODUCT_DETAILS_TO_UPDATE:{},
	INVALID_PRODUCT_DETAILS_TO_UPDATE: {},
};

describe(`Testing on Product Service`, () => {
	const BASE_URL = endpoints.PRODUCTBASEURL;

	describe(`Get all Products by clientId : ${endpoints.GETALLPRODUCTS}`, () => {
		test(`With clientId`, async () => {
			const response = await request(app)
				.get(BASE_URL + endpoints.GETALLPRODUCTS)
				.query({ clientId: data.CLIENT_ID })
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(600);
			expect(result.data.value).toBeDefined();
			expect(result.data.error).toBe(null);
		});

		test(`Without clientId`, async () => {
			const response = await request(app)
				.get(BASE_URL + endpoints.GETALLPRODUCTS)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(615);
			expect(result.data).toBeDefined();
			expect(result.data.value).toBe(null);
			expect(result.data.error).toBe(null);
		});

		test(`Invalid clientId`, async () => {
			const response = await request(app)
				.get(BASE_URL + endpoints.GETALLPRODUCTS)
				.set('Accept', 'application/json')
				.query({ clientId: `test` })
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(615);
			expect(result.data).toBeDefined();
			expect(result.data.value).toBe(null);
			expect(result.data.error).toBe(null);
		});
	});

	describe(`Create Product : ${endpoints.CREATEPRODUCT}`, () => {
		test(`With valid data`, () => {
			const response = await request(app)
				.post(BASE_URL + endpoints.CREATEPRODUCT)
				.set('Accept', 'application/json')
				.send(data.VALID_PRODUCT_DETAILS)
				.query({ clientId: data.CLIENT_ID })
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(600);
			expect(result.data.value).toBeDefined();
			expect(result.data.error).toBe(null);
		});

		test(`With invalid data`, () => {
			const response = await request(app)
				.post(BASE_URL + endpoints.CREATEPRODUCT)
				.set('Accept', 'application/json')
				.send(data.INVALID_PRODUCT_DETAILS)
				.query({ clientId: data.CLIENT_ID })
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(605);
			expect(result.data.value).toBe(null);
			expect(result.data.error).toBeDefined();
		});
	});

	escribe(
		`Update by productId and ClientId: ${endpoints.UPDATEPRODUCTBYID}`,
		() => {
			test(`With valid data`, () => {
				const response = await request(app)
					.put(BASE_URL + endpoints.UPDATEPRODUCTBYID)
					.set('Accept', 'application/json')
					.send(data.VALID_PRODUCT_DETAILS_TO_UPDATE)
					.query({ clientId: data.CLIENT_ID })
					.expect('Content-Type', /json/)
					.expect(200);
				const result = JSON.parse(response.text);
				expect(result.header.code).toBe(600);
				expect(result.data.value).toBeDefined();
				expect(result.data.error).toBe(null);
			});

			test(`With invalid data`, () => {
				const response = await request(app)
					.post(BASE_URL + endpoints.UPDATEPRODUCTBYID)
					.set('Accept', 'application/json')
					.send(data.INVALID_PRODUCT_DETAILS_TO_UPDATE)
					.query({ clientId: data.CLIENT_ID })
					.expect('Content-Type', /json/)
					.expect(200);
				const result = JSON.parse(response.text);
				expect(result.header.code).toBe(605);
				expect(result.data.value).toBe(null);
				expect(result.data.error).toBeDefined();
			});

			test(`Without data`, () => {
				const response = await request(app)
					.post(BASE_URL + endpoints.UPDATEPRODUCTBYID)
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200);
				const result = JSON.parse(response.text);
				expect(result.header.code).toBe(605);
				expect(result.data.value).toBe(null);
				expect(result.data.error).toBeDefined();
			});
		}
	);

	describe(`Delete Product by productId and ClientId: ${endpoints.DELETEPRODUCTBYID}`, () => {
		test(`Both ProductId and ClientId`, () => {
			const response = await request(app)
				.post(BASE_URL + endpoints.DELETEPRODUCTBYID)
				.set('Accept', 'application/json')
				.send(data.PRODUCTID_TO_DELETE)
				.query({ clientId: data.CLIENT_ID })
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(600);
			expect(result.data.value).toBeDefined();
			expect(result.data.error).toBe(null);
		});

		test(`Without ProductId and ClientId`, () => {
			const response = await request(app)
				.post(BASE_URL + endpoints.DELETEPRODUCTBYID)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200);
			const result = JSON.parse(response.text);
			expect(result.header.code).toBe(600);
			expect(result.data.value).toBeDefined();
			expect(result.data.value).toBe(0);
			expect(result.data.error).toBe(null);
		});
	});
});
