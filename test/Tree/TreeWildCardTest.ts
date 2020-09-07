import {assert} from "chai";
import {RouterOptions} from "../../src/router";
import {evaluateDynamicMatches, evaluateStaticMatches} from "../DispatcherClass";
import {createNewDispatcher, createNewRouteCollector} from "../helper";

//path relative ot helper.ts not this file!
const options:RouterOptions = {
	generator:"../src/Generator/Tree/TreeGeneratorStandalone",
	dispatcher:"../src/Dispatcher/Tree/TreeDispatcherStandalone"
};

//the following tests are from find-my-way check README.md#Credits for more information

describe("TreeWildCardTest",() => {
	it('should get an empty parameter from wildcard route', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/*",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/a/");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],[""]);
	});

	it('should match wildcard route', function () {
		const r = createNewRouteCollector(options);

		r.options("/*",() => {
			return "test";
		});

		r.options("/test/*",() => {
			return "test";
		});

		r.get("/test/:id",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("OPTIONS","/test/21/22");

		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["21/22"]);

		[status, routeId, params] = d.dispatch("GET","/test/21");

		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["id"],[21]);
	});

	it('should match static and param route before wildcard route', function () {
		const r = createNewRouteCollector(options);

		r.get("/*",() => {
			return "test";
		});

		r.get("/test1/foo",() => {
			return "test";
		});

		r.get("/test2/foo",() => {
			return "test";
		});

		r.get("/test1/:foo",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/test1/foo");
		evaluateStaticMatches(1,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/test2/foo");
		evaluateStaticMatches(2,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/test1/foo1");

		evaluateStaticMatches(3,200,status,routeId);
		evaluateDynamicMatches(params,["foo"],["foo1"]);

		[status, routeId, params] = d.dispatch("GET","/foo");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["foo"]);
	});

	it('should match nested wildcard cases', function () {
		const r = createNewRouteCollector(options);

		r.get("*",() => {
			return "test";
		});

		r.get("/foo1/*",() => {
			return "test";
		});

		r.get("/foo2/*",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/foo1/bar1/bar2");

		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["bar1/bar2"]);
	});

	it('should match nested wildcard cases 2', function () {
		const r = createNewRouteCollector(options);

		r.get("/foo2/*",() => {
			return "test";
		});

		r.get("/foo1/*",() => {
			return "test";
		});

		r.get("*",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/foo1/bar1/bar2");

		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["bar1/bar2"]);
	});

	it('should match nested wildcard with param and static 2', function () {
		const r = createNewRouteCollector(options);

		r.get("*",() => {
			return "test";
		});

		r.get("/foo1/*",() => {
			return "test";
		});

		r.get("/foo2/*",() => {
			return "test";
		});

		r.get("/foo3/:param",() => {
			return "test";
		});

		r.get("/foo4/param",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId] = d.dispatch("GET","/foo4/param");

		evaluateStaticMatches(4,200,status,routeId);
	});

	it('should not save the wildcard child if the prefixLen is higher than the pathLen', function () {
		const r = createNewRouteCollector(options);

		r.get("/static/*",() => {

		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static/");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],[""]);

		[status, routeId, params] = d.dispatch("GET","/static/test");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["test"]);

		[status] = d.dispatch("GET","/static");

		assert.equal(status,404);
	});

	it('should not save the wildcard child if the prefixLen is higher than the pathLen 2 (mixed routes)', function () {
		const r = createNewRouteCollector(options);

		r.get("/static/*",() => {});

		r.get("/simple",() => {});

		r.get("/simple/:bar",() => {});

		r.get("/test",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static/");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],[""]);

		[status, routeId, params] = d.dispatch("GET","/static/test");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["test"]);

		[status] = d.dispatch("GET","/static");

		assert.equal(status,404);
	});

	it('should not save the wildcard child if the prefixLen is higher than the pathLen 3 (with a root wildcard)', function () {
		const r = createNewRouteCollector(options);

		r.get("*",() => {});

		r.get("/static/*",() => {});

		r.get("/simple",() => {});

		r.get("/simple/:bar",() => {});

		r.get("/test",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static/");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],[""]);

		[status, routeId, params] = d.dispatch("GET","/static/test");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["test"]);

		[status,routeId, params] = d.dispatch("GET","/static");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["/static"]);
	});

	it('should not save the wildcard child if the prefixLen is higher than the pathLen 4 (404)', function () {
		const r = createNewRouteCollector(options);

		r.get("/static/*",() => {});

		r.get("/simple",() => {});

		r.get("/simple/:bar",() => {});

		r.get("/test",() => {});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/stati");
		assert.equal(status,404);

		[status] = d.dispatch("GET","/staticc");
		assert.equal(status,404);

		[status] = d.dispatch("GET","/stati/test");
		assert.equal(status,404);

		[status] = d.dispatch("GET","/staticc/test");
		assert.equal(status,404);
	});
});