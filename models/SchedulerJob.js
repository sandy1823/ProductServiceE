module.exports = class SchedulerJob {
	constructor({ url, method, headers, params, data }) {
		this.url = url;
		this.method = method;
		this.headers = headers;
		this.params = params;
		this.data = data;
	}
};
