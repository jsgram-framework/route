import {assert} from "chai";
import {evaluateDynamicMatches, evaluateStaticMatches, testDispatcher} from "./DispatcherClass";
import {routeTest} from "./RouteClass";
import {RouterOptions} from "../src/router";
import {createNewDispatcher, createNewRouteCollector} from "./helper";
import Node from "../src/Generator/Tree/Node";

const options:RouterOptions = {
	generator:"../src/Generator/Tree/TreeGeneratorStandalone",
	dispatcher:"../src/Dispatcher/Tree/TreeDispatcherStandalone"
};

describe("TreeDispatcherStandalone",() => {
	testDispatcher(options);
});

describe("TreeDispatcherStandaloneRouteTest",() => {
	routeTest(options);
});

//the following tests are from find-my-way check README.md#Credits for more information

describe("TreeNormalTest",() => {
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
});

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

		r.get("/static/*",() => {

		});

		r.get("/simple",() => {

		});

		r.get("/simple/:bar",() => {

		});

		r.get("/test",() => {

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

	it('should not save the wildcard child if the prefixLen is higher than the pathLen 3 (with a root wildcard)', function () {
		const r = createNewRouteCollector(options);

		r.get("*",() => {

		});

		r.get("/static/*",() => {

		});

		r.get("/simple",() => {

		});

		r.get("/simple/:bar",() => {

		});

		r.get("/test",() => {

		});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/static/");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],[""]);

		[status, routeId, params] = d.dispatch("GET","/static/test");
		evaluateStaticMatches(1,200,status,routeId);
		evaluateDynamicMatches(params,["*"],["test"]);

		[status] = d.dispatch("GET","/static");

		assert.equal(status,404);
	});

	it('should not save the wildcard child if the prefixLen is higher than the pathLen 4 (404)', function () {
		const r = createNewRouteCollector(options);

		r.get("/static/*",() => {

		});

		r.get("/simple",() => {

		});

		r.get("/simple/:bar",() => {

		});

		r.get("/test",() => {

		});

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
		const nodeClass = require("../src/Generator/Tree/Node");

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