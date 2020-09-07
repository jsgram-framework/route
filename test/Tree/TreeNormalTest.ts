import {RouterOptions} from "../../src/router";
import {evaluateDynamicMatches, evaluateStaticMatches} from "../DispatcherClass";
import {createNewDispatcher, createNewRouteCollector} from "../helper";
import {assert} from "chai";

//path relative ot helper.ts not this file!
const options:RouterOptions = {
	generator:"../src/Generator/Tree/TreeGeneratorStandalone",
	dispatcher:"../src/Dispatcher/Tree/TreeDispatcherStandalone"
};

//the following tests are from find-my-way check README.md#Credits for more information

describe("TreeNormalTest",() => {

	it('should defining static route after parametric 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/static",() => {
			return "test";
		});

		r.get("/:param",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static");
		evaluateStaticMatches(0,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/para");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["para"]);

		[status, routeId, params] = d.dispatch("GET","/s");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["s"]);
	});

	it('should defining static route after parametric 2', function () {
		const r = createNewRouteCollector(options);

		r.get("/:param",() => {
			return "test";
		});

		r.get("/static",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static");
		evaluateStaticMatches(1,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/para");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["para"]);

		[status, routeId, params] = d.dispatch("GET","/s");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["s"]);
	});

	it('should defining static route after parametric 3', function () {
		const r = createNewRouteCollector(options);

		r.get("/:param",() => {
			return "test";
		});

		r.get("/static",() => {
			return "test";
		});

		r.get("/other",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static");
		evaluateStaticMatches(1,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/para");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["para"]);

		[status, routeId, params] = d.dispatch("GET","/s");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["s"]);

		[status, routeId, params] = d.dispatch("GET","/o");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["o"]);
	});

	it('should defining static route after parametric 4', function () {
		const r = createNewRouteCollector(options);

		r.get("/static",() => {
			return "test";
		});

		r.get("/:param",() => {
			return "test";
		});

		r.get("/other",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static");
		evaluateStaticMatches(0,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/para");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["para"]);

		[status, routeId, params] = d.dispatch("GET","/s");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["s"]);

		[status, routeId, params] = d.dispatch("GET","/o");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["o"]);
	});

	it('should defining static route after parametric 5', function () {
		const r = createNewRouteCollector(options);

		r.get("/static",() => {
			return "test";
		});

		r.get("/other",() => {
			return "test";
		});

		r.get("/:param",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static");
		evaluateStaticMatches(0,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/para");
		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["para"]);

		[status, routeId, params] = d.dispatch("GET","/s");
		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["s"]);

		[status, routeId, params] = d.dispatch("GET","/o");
		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["o"]);
	});

	it('should match parametric route with a dash', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/:param/b",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/a/foo-bar/b");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["foo-bar"]);
	});

	it('should match parametric route with a multiple dash', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/:param",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/a/perfectly-fine-route");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],["perfectly-fine-route"]);
	});

	it('should match dynamic route', function () {
		const r = createNewRouteCollector(options);

		r.get("/foo/:fooParam",() => {
			return "test";
		});

		r.get("/foo/bar/:barParam",() => {
			return "test";
		});

		r.get("/foo/search",() => {
			return "test";
		});

		r.get("/foo/submit",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/foo/awesome-parameter");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["fooParam"],["awesome-parameter"]);

		[status, routeId, params] = d.dispatch("GET","/foo/b-first-character");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["fooParam"],["b-first-character"]);

		[status, routeId, params] = d.dispatch("GET","/foo/s-first-character");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["fooParam"],["s-first-character"]);

		[status, routeId, params] = d.dispatch("GET","/foo/se-prefix");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["fooParam"],["se-prefix"]);

		[status, routeId, params] = d.dispatch("GET","/foo/sx-prefix");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["fooParam"],["sx-prefix"]);
	});

	it('should match dynamic route with common prefix', function () {
		const r = createNewRouteCollector(options);

		r.get("/test",() => {
			return "test";
		});

		r.get("/:test",() => {
			return "test";
		});

		r.get("/test/hello",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId] = d.dispatch("GET","/test");

		evaluateStaticMatches(0,200,status,routeId);
	});

	it('should not match parametric route without the parameter', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/:param",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/a");

		assert.equal(status,404);
	});

	it('should get an empty parameter', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/:param",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/a/");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["param"],[""]);
	});

	it('should get the same tree 1', function () {
		const r1 = createNewRouteCollector(options);
		const r2 = createNewRouteCollector(options);

		r1.get("/static","");
		r1.get("/:param","");

		r2.get("/static","");
		r2.get("/:param","");

		assert.deepEqual(r1.getData(),r2.getData());
	});

	it('should get the same tree 2', function () {
		const r1 = createNewRouteCollector(options);
		const r2 = createNewRouteCollector(options);
		const r3 = createNewRouteCollector(options);

		r1.get("/static","");
		r1.get("/:param","");
		r1.get("/other","");

		r2.get("/static","");
		r2.get("/:param","");
		r2.get("/other","");

		r3.get("/static","");
		r3.get("/:param","");
		r3.get("/other","");

		const tree1 = r1.getData();
		const tree2 = r2.getData();
		const tree3 = r3.getData();

		assert.deepEqual(tree1,tree2);
		assert.deepEqual(tree1,tree3);
		assert.deepEqual(tree2,tree3);
	});
});