# simple-api-node

[simple-api-express](https://github.com/J-Siu/simple-api-express) is an expressjs api handler (NOT middleware) that work with
[simple-api-client-ng2](https://github.com/J-Siu/simple-api-client-ng2), an Angular 2 api service.

## Index

- [Install](#install)
- [Usage](#usage)
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
app.use(bodyParser.json())
app.listen(8080);
```

Import `simple-api-node`:

```javascript
const SimpleApi = require('simple-api-node').SimpleApi;
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
const SimpleApi = require('simple-api-node').SimpleApi;
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
- `callback` : a function that take a single argunment as api parameter.

```javascript
apiDemo.register('echo2',param => 'echo2:' + param);
```

#### registerObject
`registerObject(object)` register all functions of an object as api callbacks.

All functions of the object should take a single argunment as api parameter.

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

#### handler



### Error Handleing



## Example

[simple-api-example-ng2-express](https://github.com/J-Siu/simple-api-example-ng2-express)

## Contributors

* John Sing Dao Siu (<john.sd.siu@gmail.com>)

## Changelog

* 1.2.0

## License

The MIT License

Copyright (c) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
