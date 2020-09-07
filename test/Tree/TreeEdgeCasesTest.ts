import {assert} from "chai";
import {RouterOptions} from "../../src/router";
import {evaluateDynamicMatches, evaluateStaticMatches} from "../DispatcherClass";
import Node from "../../src/Generator/Tree/Node";
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

	it('should not use an invalid node type', function () {
		const nodeClass = require("../../src/Generator/Tree/Node");

		assert.throws(() => {
			const parent = new Node('/a');

			//es 5 style because typescript will not allow this
			const child =new nodeClass.default('/a',{},5);

			parent.addChild(child);
		},"");
	});

	it('parametricBrother of Parent Node, with a parametric child', function () {
		const parent = new Node('/a');

		const parametricChild = new Node(':id');

		parent.addChild(parametricChild);

		assert.equal(parent.parametricBrother, null);
	});

	it('parametricBrother of Parent Node, with a parametric child and a static child', function () {
		const parent = new Node('/a');

		const parametricChild = new Node(':id');
		const staticChild = new Node('/b');

		parent.addChild(parametricChild);
		parent.addChild(staticChild);

		assert.equal(parent.parametricBrother, null);
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
});