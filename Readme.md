# simple-api-express

[simple-api-express](https://github.com/J-Siu/simple-api-express) is an expressjs api handler (NOT middleware) that work with
[simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2), an Angular 2 api service.

## Index

- [Install](#install)
- [Usage Flow](#usage-flow)
	- [API](#api)
		- [constructor](#constructor)
		- [debug](#debug)
		- [list](#list)
		- [register](#register)
		- [registerObject](#registerobject)
		- [response](#response)
		- [handler](#handler)
	- [Error Handleing](#error-handleing)
		- [404 Not Found](#404-not-found)
		- [Callback throw](#callback-throw)
- [Example](#example)
- [Contributors](#contributors)
- [Changelog](#changelog)
- [License](#license)

## Install

```
npm install simple-api-express
```

## Usage Flow

`simple-api-express` depends on expressjs middleware bodyParser for json body decode.

```javascript
const express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.listen(8080);
```

Import `simple-api-express`:

```javascript
const SimpleApi = require('simple-api-express').SimpleApi;
```

Create api object with base url:

```javascript
const apiDemoUrl = '/demo';
var apiDemo = new SimpleApi(apiDemoUrl, true); // enable debug
```

Register a function as api callback:

```javascript
apiDemo.register('echo2',param => 'echo2:' + param);
```

You can also register all functions of an object as api callbacks:

```javascript
apiDemo.registerObject(require('./api-object').DemoObj);
```

Use express post and `SimpleApi.response()` to handle incoming api request:

```javascript
// Post request + API response
app.post(path.join(apiDemoUrl, '*'), (req, res) => apiDemo.response(req, res))
```

`SimpleApi.handler()` can be use if additioanl action(eg: customing response header or error page)
is required before reply:

```javascript
// Post request + API handler
app.post(path.join(apiDemoUrl, '*'), (req, res) => {
	// Log request body before process
	console.log(req.body);
	try {
		// Manual handler used, server code responsible to send result and handle error
		// Use manual handler if custom header or custom 404 error are needed
		let result = apiDemo.handler(req);

		// Result must be return in json format
		res.json(result);
	}
	catch (e) {
		// Catch api not found error
		res.status(e.status).end(e.error);
	}
})
```

### API

#### constructor
`SimpleApi(baseUrl:string, debug:boolean)`

- `baseUrl` will prefix all api url registered to this SimpleApi instance.
- `debug` will enable/disable debug log. Default to false.

```javascript
const SimpleApi = require('simple-api-express').SimpleApi;
const apiDemoUrl = '/demo';
var apiDemo = new SimpleApi(apiDemoUrl, true); // enable debug
```

#### debug
`debug(enable: boolean)` can enable/disable debug log.
```javascript
apiDemo.debug(false);
```

#### list
`list()` return a `string[]` containing all registered api url.
```javascript
console.log(apiDemo.list());
```
Output:
```
[ '/demo/echo', '/demo/echo2' ]
```

#### register
`register(url:string,callback)` register a callback function to `url`

- `url` : Api url path after baseUrl. The resulting url for the api is baseUrl/url.
- `callback` : a function that take a single argunment as api parameter, and return a result.

```javascript
apiDemo.register('echo2',param => 'echo2:' + param);
```

#### registerObject
`registerObject(object)` register all functions of an object as api callbacks.

All functions of the object should take a single argunment as api parameter, and return a result.

The function name will be used api url.

```javascript
var DemoObj = {
	echo(r) {
		return r;
	}
}

apiDemo.registerObject(DemoObj);
```
#### response
`SimpleApi.response(req, res)` is a handle function for incoming api post request.
Api parameter will be passed to corresponding callback.
Callback result will be passed back to api client.

`req, res` are request and response object pass in from expressjs post.

```javascript
// Post request + API response
app.post(path.join(apiDemoUrl, '*'), (req, res) => apiDemo.response(req, res))
```

#### handler

`SimpleApi.handler(req)` is an api handler function.
It will invoke the corresponding callback base on the request url, and return the result.

IT WILL NOT send out the result.

IT IS NOT a expressjs post handler function. It needed to be called INSIDE the post handler function.

Api handler can be use if additioanl action(eg: customing response header or error page)
is required:

```javascript
// Post request + API handler
app.post(path.join(apiDemoUrl, '*'), (req, res) => {
	// Log request body before process
	console.log(req.body);
	try {
		// Manual handler used, server code responsible to send result and handle error
		// Use manual handler if custom header or custom 404 error are needed
		let result = apiDemo.handler(req);

		// Result must be return in json format
		res.json(result);
	}
	catch (e) {
		// Catch api not found error
		res.status(e.status).end(e.error);
	}
})
```

### Error Handleing

There are two types of error.

#### 404 Not Found

When `response()` is called with an non-exist api url,
it will response with a HTTP 404 Not Found.

When `handle()` is called with an non-exist api url,
it will throw an error,
which can be caught in the post handle function.

#### Callback throw

When `response()` is called,
and the invoked api callback throw an error,
which will be passed to remote client.
The remote client, using [simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2),
will throw an exception with the error.

When `handle()` is called,
and the invoked api callback throw an error,
the error can be inspected from the result object.

```javascript
		let result = apiDemo.handler(req);

		// If api callback return
		if(result.error) {
			console.log(result.error);
		}

		// Result must be return in json format
		res.json(result);
```

The remote client, using [simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2),
will throw an exception with the error.

## Example

A detail example for both
[simple-api-express](https://github.com/J-Siu/simple-api-express) and
[simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2).

- [simple-api-example-ng2-express](https://github.com/J-Siu/simple-api-example-ng2-express)

## Contributors

* [John Sing Dao Siu](https://github.com/J-Siu)

## Changelog

* 1.2.0
	- Publish to NPM.
* 1.2.1
	- Fix Readme.md typo
* 1.2.2
	- Update package.json
	- Update Readme.md

## License

The MIT License

Copyright (c) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
