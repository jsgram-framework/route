import {assert} from "chai";
import {createNewDispatcher, createNewRouteCollector} from "./helper";

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

describe("GroupPosBasedDispatcher",() => {
	//Static routes matchen
	it('should match static GET route', function () {
		const r = createNewRouteCollector();

		r.get("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("GET","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static POST route', function () {
		const r = createNewRouteCollector();

		r.post("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static PUT route', function () {
		const r = createNewRouteCollector();

		r.put("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PUT","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static DELETE route', function () {
		const r = createNewRouteCollector();

		r.delete("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("DELETE","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static HEAD route', function () {
		const r = createNewRouteCollector();

		r.head("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("HEAD","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static PATCH route', function () {
		const r = createNewRouteCollector();

		r.patch("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PATCH","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static ANY route', function () {
		const r = createNewRouteCollector();

		r.any("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	it('should match static getpost route', function () {
		const r = createNewRouteCollector();

		r.getpost("/test",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		let [status, routeId, params] = d.dispatch("GET","/test");

		evaluateStaticMatches(0,200,status,routeId,params);

		[status, routeId, params] = d.dispatch("POST","/test");

		evaluateStaticMatches(0,200,status,routeId,params);
	});

	//dynamic
	it('should match dynamic GET route', function () {
		const r = createNewRouteCollector();

		r.get("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("GET","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic POST route', function () {
		const r = createNewRouteCollector();

		r.post("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("POST","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic PUT route', function () {
		const r = createNewRouteCollector();

		r.put("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PUT","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic DELETE route', function () {
		const r = createNewRouteCollector();

		r.delete("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("DELETE","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic HEAD route', function () {
		const r = createNewRouteCollector();

		r.head("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("HEAD","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic PATCH route', function () {
		const r = createNewRouteCollector();

		r.patch("/test/:id/:id2",() => {
			return "test";
		});

		const d = createNewDispatcher(r);

		const [status, routeId, params] = d.dispatch("PATCH","/test/21/22");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],[21,22]);
	});

	it('should match dynamic ANY route', function () {
		const r = createNewRouteCollector();

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

	//match from route map with groups

});