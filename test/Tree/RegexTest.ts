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
	it('should match route with regex', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/:id(^\\d+$)",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/test/12");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id"],["12"]);

		[status] = d.dispatch("GET","/test/12abc");
		assert.equal(status,404);
	});

	it('should match route with mixed param and regex', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/:id(^\\d+$)/hello/:world",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/test/12/hello/world");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","world"],["12","world"]);
	});

	it('should match route with double regex', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/:id(^\\d+$)/hello/:world(^\\d+$)",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId, params] = d.dispatch("GET","/test/12/hello/15");
		evaluateStaticMatches(0,200,status,routeId);
		evaluateDynamicMatches(params,["id","world"],["12","15"]);

		[status] = d.dispatch("GET","/test/12/hello/test");
		assert.equal(status,404);
	});

	it('should throw an error because of the false regex', function () {
		const r = createNewRouteCollector(options);

		r.get("/foo/:id(a","");

		assert.throws(() => {
			createNewDispatcher(r,options);
		});
	});

	it('should match route with regex 1', function () {
		const r = createNewRouteCollector(options);

		r.get("/a/:uuid(^[\\d-]{19})/:user(^\\w+)/account",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId] = d.dispatch("GET","/a/1111-2222-3333-4445/bar/account");
		evaluateStaticMatches(0,200,status,routeId);
	});

	it('should match route with regex 2', function () {
		const r = createNewRouteCollector(options);

		r.get("/foo/:id(([a-f0-9]{3},?)+)",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId] = d.dispatch("GET","/foo/qwerty");

		assert.equal(status,404);

		[status, routeId] = d.dispatch("GET","/foo/bac,1ea");
		evaluateStaticMatches(0,200,status,routeId);
	});

	it('should match route with regex escape chars 2', function () {
		const r = createNewRouteCollector(options);

		r.get("/foo/:param(\\([a-f0-9]{3}\\))",() => {});

		const d = createNewDispatcher(r,options);

		let [status, routeId] = d.dispatch("GET","/foo/abc");

		assert.equal(status,404);

		[status, routeId] = d.dispatch("GET","/foo/(abc)");
		evaluateStaticMatches(0,200,status,routeId);
	});
});