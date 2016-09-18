import path = require('path');

export class SimpleApi {
	// api callback array
	private callback = {};
	private baseUrl: string;
	private debugLog = console.log;
	constructor(url: string, debug: boolean = false) {
		this.baseUrl = url;
		this.debug(debug);
	}

	debug(d: boolean) {
		if (d) { this.debugLog = console.log; }
		else { this.debugLog = function () { }; }
	}

	// list register api
	list(): string[] {
		return Object.keys(this.callback);
	}

	// register single callback
	register(p, cb): boolean {
		let apiPath = path.normalize(path.join(this.baseUrl, p));
		if (this.callback[apiPath]) {
			this.debugLog('SimpleApi.register: ' + apiPath + ' already register.');
			return false;
		} else {
			this.callback[apiPath] = cb;
			this.debugLog('SimpleApi.register: ' + apiPath);
			return true;
		}
	}

	// register all function of an object
	registerObject(obj) {
		this.debugLog('SimpleApi.registerObject: ' + this.baseUrl + ' - Start');
		Object.keys(obj).forEach(i => this.register(i, obj[i]));
		this.debugLog('SimpleApi.registerObject: ' + this.baseUrl + ' - End');
	}

	unregister(p) { }

	unregisterObj(obj) { }

	// api handler does not send response
	handler(req): {} {
		if (this.callback[req.url]) {
			try {
				// callback result will be passed back to api client
				this.debugLog('SimpleApi.handler callback params: ' + JSON.stringify(req.body.params, null, 2));
				let result = { result: this.callback[req.url](req.body.params, req.params) };
				this.debugLog('SimpleApi.handler callback result: ' + JSON.stringify(result, null, 2));
				return result;
			} catch (e) {
				// callback error will be passed back to api client
				let error = { error: e };
				this.debugLog('SimpleApi.handler callback error: ' + JSON.stringify(error, null, 2));
				return error;
			}
		} else {
			// throw api not found error to api server
			let error = { status: 404, error: req.url + ' not found' };
			this.debugLog('SimpleApi.handler throw error: ' + JSON.stringify(error, null, 2));
			throw error;
		}
	}

	// response handler will handle respose
	response(req, res) {
		try {
			this.debugLog('SimpleApi.response callback params: ' + JSON.stringify(req.body.params, null, 2));
			res.json(this.handler(req));
		}
		catch (e) {
			res.status(e.status).end(e.error);
		}
	}

};
