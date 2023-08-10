const request = require(`supertest`);
const mongoose = require('mongoose');
const app = require(`../app`);
var endpoints = require('../utils/endpoints');

afterAll(async () => {
	await mongoose.disconnect();
});

const data = {
	CLIENT_ID: `123`,
	VALID_ATTRIBUTE_DETAILS: {
		clientId: '123',
		attrId: 'A123',
		attrName: 'size',
		attrDesc: "describes product's width and height",
		attrValue: ['XL', 'S'],
		attrType: 'test',
		attrPattern: '[S,M,XL,XXL]',
		createdBy: 'testuser',
	},
	INVALID_ATTRIBUTE_DETAILS: {},
};

describe(`Testing on attribute Service`, () => {
	const BASE_URL = endpoints.ATTRIBUTEBASEURL;

	describe(`Get all attributes by clientId : ${endpoints.GETALLATTRIBUTES}`, () => {
		test(`With clientId`, async () => {
			const response = await request(app)
				.get(BASE_URL + endpoints.GETALLATTRIBUTES)
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
				.get(BASE_URL + endpoints.GETALLATTRIBUTES)
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
				.get(BASE_URL + endpoints.GETALLATTRIBUTES)
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

	// describe(`Create attribute : ${endpoints.CREATEATTRIBUTE}`, () => {
	// 	test(`With valid data`, async () => {
	// 		const response = await request(app)
	// 			.post(BASE_URL + endpoints.CREATEATTRIBUTE)
	// 			.set('Accept', 'application/json')
	// 			.send(data.VALID_ATTRIBUTE_DETAILS)
	// 			.query({ clientId: data.CLIENT_ID })
	// 			.expect('Content-Type', /json/)
	// 			.expect(200);
	// 		const result = JSON.parse(response.text);
	// 		expect(result.header.code).toBe(600);
	// 		expect(result.data.value).toBeDefined();
	// 		expect(result.data.error).toBe(null);
	// 	});

	// 	test(`With invalid data`, async () => {
	// 		const response = await request(app)
	// 			.post(BASE_URL + endpoints.CREATEATTRIBUTE)
	// 			.set('Accept', 'application/json')
	// 			.send(data.INVALID_ATTRIBUTE_DETAILS)
	// 			.query({ clientId: data.CLIENT_ID })
	// 			.expect('Content-Type', /json/)
	// 			.expect(200);
	// 		const result = JSON.parse(response.text);
	// 		expect(result.header.code).toBe(605);
	// 		expect(result.data.value).toBe(null);
	// 		expect(result.data.error).toBeDefined();
	// 	});
	// });
});
