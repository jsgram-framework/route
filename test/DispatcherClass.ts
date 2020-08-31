import {assert} from "chai";
import {createNewDispatcher, createNewRouteCollector, createRouteMap} from "./helper";
import {RouterOptions} from "../src/router";

function evaluateStaticMatches(expectedRouteId: number, expectedStatus: number, status: number, routeId: number, params = null)
{
	assert.equal(status,expectedStatus);
	assert.equal(routeId,expectedRouteId);

	if(params !== null) {
		assert.typeOf(params,'Map');
		assert.isEmpty(params);
	}
}

function evaluateDynamicMatches(params: Map<string,any>, paramNames: string[], paramValues: any[])
{
	let i = 0;
	for (let paramName of paramNames) {
		let param = params.get(paramName);

		assert.equal(param,paramValues[i]);

		++i;
	}
}

function evaluateBigMap(method: string, path: string, expectedRouteId: number, routerOptions: RouterOptions = {}, paramNames: string[] = [], paramValues: any[] = [])
{
	const d = createNewDispatcher(createRouteMap(routerOptions));

	const [status,routeId, params] = d.dispatch(method,path);

	evaluateStaticMatches(expectedRouteId,200,status,routeId);

	if(paramNames.length > 0 && paramValues.length > 0) {
		evaluateDynamicMatches(params,paramNames,paramValues);
	}
}

export function testDispatcher(options: RouterOptions = {})
{
	it('should react to no routes', function () {
		const r = createNewRouteCollector(options);

		const d = createNewDispatcher(r);

		const [status] = d.dispatch("GET","/test");

		assert.equal(status,404);
	});

	it('should react to 404 not found', function () {
		const r = createNewRouteCollector(options);

		r.get("/",() => {});

		const d = createNewDispatcher(r);

		const [status] = d.dispatch("GET","/test");

		assert.equal(status,404);
	});

	it('should react to no static route with 404', function () {
		const r = createNewRouteCollector(options);

		r.get("/:id",() => {});

		const d = createNewDispatcher(r);

		const [status] = d.dispatch("GET","/test/21");

		assert.equal(status,404);
	});

	//Static routes matchen
	it('should match the index GET route', function () {
		const r = createNewRouteCollector(options);

		r.get("/",() => {
			return "test"
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("GET","/");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static GET route', function () {
		const r = createNewRouteCollector(options);

		r.get("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("GET","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static POST route', function () {
		const r = createNewRouteCollector(options);

		r.post("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static PUT route', function () {
		const r = createNewRouteCollector(options);

		r.put("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PUT","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static DELETE route', function () {
		const r = createNewRouteCollector(options);

		r.delete("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("DELETE","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static HEAD route', function () {
		const r = createNewRouteCollector(options);

		r.head("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("HEAD","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static PATCH route', function () {
		const r = createNewRouteCollector(options);

		r.patch("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PATCH","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static ANY route', function () {
		const r = createNewRouteCollector(options);

		r.any("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static getpost route', function () {
		const r = createNewRouteCollector(options);

		r.getpost("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		let [status, routeId, params] = d.dispatch("GET","/test");

		evaluateStaticMatches(0,200,status,routeId,params);

		[status, routeId, params] = d.dispatch("POST","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static GET route from HEAD method', function () {
		const r = createNewRouteCollector(options);

		r.get("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		let [status, routeId, params] = d.dispatch("HEAD","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	//dynamic
	it('should match dynamic GET route', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("GET","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic POST route', function () {
		const r = createNewRouteCollector(options);

		r.post("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic PUT route', function () {
		const r = createNewRouteCollector(options);

		r.put("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PUT","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic DELETE route', function () {
		const r = createNewRouteCollector(options);

		r.delete("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("DELETE","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic HEAD route', function () {
		const r = createNewRouteCollector(options);

		r.head("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("HEAD","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic PATCH route', function () {
		const r = createNewRouteCollector(options);

		r.patch("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PATCH","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic ANY route', function () {
		const r = createNewRouteCollector(options);

		r.any("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic getpost route', function () {
		const r = createNewRouteCollector();

		r.getpost("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		let [status, routeId, params] = d.dispatch("GET","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);

		[status, routeId, params] = d.dispatch("POST","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	//custom placeholder
	it('should match only number parameter', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/:id(\\d+)",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		let [status, routeId, params] = d.dispatch("GET","/test/21");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id"],[21]);

		//try non number param
		[status] = d.dispatch("GET","/test/21abc");
		assert.equal(status,404);
	});

	it('should match with unknown parameter', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/(.*)/:id(\\d+)",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		let [status, routeId, params] = d.dispatch("GET","/test/unknownPart123/21");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id"],[21]);

		//try non number param
		[status] = d.dispatch("GET","/test/unknownPart123/21abc");
		assert.equal(status,404);
	});

	it('should match with specific parameter', function () {
		const r = createNewRouteCollector(options);

		r.get("/(user|u)/:id",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		//try with u
		let [status, routeId, params] = d.dispatch("GET","/u/21");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id"],[21]);

		//try with user
		[status, routeId, params] = d.dispatch("GET","/user/abc");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id"],["abc"]);
	});

	//real world example
	it('should match routes in groups', function () {
		const path = "/test1/21";

		evaluateBigMap("GET",path,1,options,['id'],[21]);
	});

	it('should match routes in nested groups', function () {
		const path = "/test1/nestedGroup1/nestedRoute1";

		evaluateBigMap("GET",path,21);
	});

	it('should match routes in nested groups dynamic', function () {
		const path = "/test1/nestedGroup1/nestedGroup2/nestedRoute2/21";

		evaluateBigMap("GET",path,24,options,['id'],[21]);
	});

	it('should match routes with many placeholder', function () {
		const path = "/dynamic/22/33/44";

		evaluateBigMap("GET",path,27,options,['id2','id3','id4'],[22,33,44]);
	});

	//check if generated routes could match in long running applications
	it('should match routes while long running', function () {
		const method = "GET";

		const d = createNewDispatcher(createRouteMap());

		//create new path with i for id2, i+1 for id3 and i+2 for id4 e.g. run 800 -> i = 800 id2 = 800, id3 = 801, id4 = 802

		for (let i = 0; i< 1000; ++i) {
			const path = "/dynamic/"+ (i) + "/" + (i+1) + "/" + (i+2);

			let [status,routeId, params] = d.dispatch(method,path);

			evaluateStaticMatches(27,200,status,routeId);
			evaluateDynamicMatches(params,['id2','id3','id4'],[(i),(i+1),(i+2)]);
		}
	});
}