[![](https://gitlab.com/grammm/php-gram/phpgram/raw/master/docs/img/Feather_writing.svg.png)](https://gitlab.com/grammm/jsgram/route)


# gram-route
[![pipeline status](https://gitlab.com/grammm/jsgram/route/badges/master/pipeline.svg)](https://gitlab.com/grammm/jsgram/route/-/commits/master) 
[![coverage report](https://gitlab.com/grammm/jsgram/route/badges/master/coverage.svg)](https://gitlab.com/grammm/jsgram/route/-/commits/master)
[![pipeline status](https://img.shields.io/npm/v/gram-route)](https://www.npmjs.com/package/gram-route)
[![pipeline status](https://img.shields.io/npm/l/gram-route)](https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE)
  

A fast http router for node. Matches static routes with hashmap lookup and wildcard routes with assembled regex.

Based on [nikic/fast-route](https://github.com/nikic/FastRoute)

````javascript

//es 6
import {router, dispatcher} from 'gram-route';

let r = router();

//a static route without parameters
//route has a method, a path (or pattern) and a handler (which can be anything)
r.get("/",(req, res) => {
	res.write("Hello world");
});

//a route with a placeholder (wildcard)
//:id can be anything until the next /
//check out path-to-regex
r.get("/user/:id",(req, res, id) => {
	res.write("page from user: " +id);
});

//group
//routes can placed in groups so every route got the same prefix
//a group needs a callback where all routes of this group will be placed
r.group("/admin",() => {
	r.get("",(req, res) => {
		res.write("Admin main page");
	});
	
	r.get("/server-status",(req, res) => {
		res.write("Server is still working");
	});
	
	//nested groups, the group inside will get the prefix of the outside group
	r.group("/user-manager",() => {
		//route: /admin/user-manager/:id
		r.get("/:id",(req, res, id) => {
			res.write("all data from user: " +id);
		});
		
		r.post("",(req, res) => {
			res.write("user successfully created");
		});
	});
});

// router() will always returns the same instance with the same options (see Extendable)
let c = router();

c.get("/123",(req, res) => {
	res.write("hello 123");
});

//the dispatcher will match the requested path
//and returns a route object with all information's about the matched route and the paramter if the route where dynamic
//make sure dispatcher() will created AFTER the routes are collected (after all route collectors)
let d = dispatcher();

//sample server

var http = require('http');

const server = http.createServer(function (req, res) {
	//result contains the status (e.g. 200 or 404), the route id and the parameters
	// [status,route id,parameter]
	let result = d.dispatch(req.method,req.url);

	if(result[0] === 200) {
		//found
		let route = r.getRoute(result[1]);

		let callback = route.handler;	//handler is in the case a callback

		let middleware = route.getMiddleware();	//retuns all middleware to this route (group and route middleware) as an array

		callback(req,res, ... Array.from(result[2].values()));
	} else {
		//not found, 404
	}

	res.end();
});

const hostname = '127.0.0.1';
const port = 3000;

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
````

````javascript

//es 5
var router = require("gram-route");

var r = router.router();	//router

var d = router.dispatcher();	//dispatcher
````

## Extendable

The generator, dispatcher and collector can be changed.

````javascript
import {router, dispatcher} from 'gram-route';

//options
//Generator must implement GeneratorInterface and must be compatible with the dispatcher
//Dispatcher must implement the DispatcherInterface
//Collector must implement the RouteCollectorInterface
const options = {
	generator:"",	//the require path
	dispatcher:"",
	collector:""
};

let r = router(options);

//now every instance of router() uses the new options
````

## Credits

- Router Algorithm : [Copyright by Nikita Popov](https://github.com/nikic/FastRoute/blob/master/LICENSE).