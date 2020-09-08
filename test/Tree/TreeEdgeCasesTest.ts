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

describe("TreeEdgeCasesTest",() => {
	it('should match nested static parametric route, url with parameter common prefix > 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/bbbb",() => {
			return "test";
		});

		r.get("/a/bbaa",() => {
			return "test";
		});

		r.get("/a/babb",() => {
			return "test";
		});

		r.get("/a/:id",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId] = d.dispatch("GET","/a/bbbb");
		evaluateStaticMatches(0,200,status,routeId);

		[status, routeId] = d.dispatch("GET","/a/bbaa");
		evaluateStaticMatches(1,200,status,routeId);

		[status, routeId] = d.dispatch("GET","/a/babb");
		evaluateStaticMatches(2,200,status,routeId);

		let params;
		[status, routeId,params] = d.dispatch("GET","/a/babbr");
		evaluateStaticMatches(3,200,status,routeId);
		evaluateDynamicMatches(params,["id"],["babbr"]);
	});

	it('should match dynamic route with common prefix > 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/aaa",() => {
			return "test";
		});

		r.get("/aabb",() => {
			return "test";
		});

		r.get("/abc",() => {
			return "test";
		});

		r.get("/:id",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/aab");

		evaluateStaticMatches(3,200,status,routeId);
		evaluateDynamicMatches(params,["id"],["aab"]);
	});

	it('should match dynamic route with multi parameter common prefix > 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/:id/aaa/:id2",() => {
			return "test";
		});

		r.get("/:id/aabb/:id2",() => {
			return "test";
		});

		r.get("/:id/abc/:id2",() => {
			return "test";
		});

		r.get("/:a/:b",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/test/aab");

		evaluateStaticMatches(3,200,status,routeId);
		evaluateDynamicMatches(params,["a","b"],["test","aab"]);

		[status, routeId, params] = d.dispatch("GET","/test/aaa/test2");

		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],["test","test2"]);

		[status, routeId, params] = d.dispatch("GET","/test/aabb/test2");

		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],["test","test2"]);

		[status, routeId, params] = d.dispatch("GET","/test/abc/test2");

		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["id","id2"],["test","test2"]);
	});

	it('should match mixed dynamic route with last defined route being static', function () {
		const r = createNewRouteCollector(options);

		r.get("/test",() => {
			return "test";
		});

		r.get("/test/:a",() => {
			return "test";
		});

		r.get("/test/hello/:b",() => {
			return "test";
		});

		r.get("/test/hello/:c/test",() => {
			return "test";
		});

		r.get("/test/hello/:c/:k",() => {
			return "test";
		});

		r.get("/test/world",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/test");
		evaluateStaticMatches(0,200,status,routeId);

		[status, routeId, params] = d.dispatch("GET","/test/hello");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["a"],["hello"]);

		[status, routeId, params] = d.dispatch("GET","/test/hello/world");
		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["b"],["world"]);

		[status, routeId, params] = d.dispatch("GET","/test/hello/world/test");
		evaluateStaticMatches(3,200,status,routeId);
		evaluateDynamicMatches(params,["c"],["world"]);

		[status, routeId, params] = d.dispatch("GET","/test/hello/world/te");
		evaluateStaticMatches(4,200,status,routeId);
		evaluateDynamicMatches(params,["c","k"],["world","te"]);

		[status, routeId, params] = d.dispatch("GET","/test/hello/world/test1");
		evaluateStaticMatches(4,200,status,routeId);
		evaluateDynamicMatches(params,["c","k"],["world","test1"]);

		[status, routeId, params] = d.dispatch("GET","/test/world");
		evaluateStaticMatches(5,200,status,routeId);
	});

	it('should match param route inside nested static', function () {
		const r = createNewRouteCollector(options);

		r.get("/api/foo/b2",() => {

		});

		r.get("/api/foo/bar/qux",() => {

		});

		r.get("/api/foo/:id/bar",() => {

		});

		r.get("/foo",() => {

		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/api/foo/b-123/bar");
		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["id"],["b-123"]);
	});

	it('should match wildcard mixed with dynamic', function () {
		const r = createNewRouteCollector(options);

		r.options("/*",() => {

		});

		r.options("/obj/*",() => {

		});

		r.get("/obj/params/*",() => {

		});

		r.get("/obj/:id",() => {

		});

		r.get("/obj_params/:id",() => {

		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("OPTIONS","/obj_params/params");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["obj_params/params"]);

		[status, routeId, params] = d.dispatch("OPTIONS","/obj/params");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["params"]);

		[status, routeId, params] = d.dispatch("OPTIONS","/obj/params/12");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["params/12"]);

		[status, routeId, params] = d.dispatch("GET","/obj/params/12");
		evaluateStaticMatches(2,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["12"]);
	});

	it('should match single-character prefix', function () {
		const r = createNewRouteCollector(options);

		r.get("/b",() => {
			return "test";
		});

		r.get("/b/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should match multi-character prefix', function () {
		const r = createNewRouteCollector(options);

		r.get("/bu",() => {
			return "test";
		});

		r.get("/bu/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should not match this static 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb",() => {
			return "test";
		});

		r.get("/bb/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should not match this static 2', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb/ff",() => {
			return "test";
		});

		r.get("/bb/ff/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);

		[status] = d.dispatch("GET","/ff/bulk");

		assert.equal(status,404);
	});

	it('should not match this static 3', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb/ff",() => {
			return "test";
		});

		r.get("/bb/ff/bulk",() => {
			return "test";
		});

		r.get("/bb/ff/gg/bulk",() => {
			return "test";
		});

		r.get("/bb/ff/bulk/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);

		[status] = d.dispatch("GET","/ff/bulk");

		assert.equal(status,404);
	});

	it('should not match this dynamic route 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/:foo/",() => {
			return "test";
		});

		r.get("/:foo/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should not match this dynamic route 2', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb",() => {
			return "test";
		});

		r.get("/bb/:foo",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should not match this dynamic route 3', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb/ff",() => {
			return "test";
		});

		r.get("/bb/ff/:foo",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should not match this dynamic route 4', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb/:foo",() => {
			return "test";
		});

		r.get("/bb/:foo/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);
	});

	it('should not match this dynamic route 5', function () {
		const r = createNewRouteCollector(options);

		r.get("/bb/:foo/aa",() => {
			return "test";
		});

		r.get("/bb/:foo/aa/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);

		[status] = d.dispatch("GET","/bb/foo/bulk");

		assert.equal(status,404);
	});

	it('should not match this dynamic route 6', function () {
		const r = createNewRouteCollector(options);

		r.get("/static/:parametric/static/:parametric",() => {
			return "test";
		});

		r.get("/static/:parametric/static/:parametric/bulk",() => {
			return "test";
		});

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/bulk");

		assert.equal(status,404);

		[status] = d.dispatch("GET","/static/foo/bulk");

		assert.equal(status,404);

		[status] = d.dispatch("GET","/static/foo/static/bulk");

		assert.equal(status,200);
	});
});