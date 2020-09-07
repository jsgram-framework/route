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