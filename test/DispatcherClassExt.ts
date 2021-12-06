import {RouterOptions} from "../src/router";
import {evaluateDynamicMatches, evaluateStaticMatches} from "./DispatcherClass";
import {createNewDispatcher, createNewRouteCollector} from "./helper";
import {assert} from "chai";

export function testDispatcherExt(options: RouterOptions)
{
	it("should match with unknown parameter", function() {
		const r = createNewRouteCollector(options);

		r.get("/test/(.*)/:id([0-9]+)", () => {
			return "test";
		});

		const d = createNewDispatcher(r, options);

		// eslint-disable-next-line prefer-const
		let [status, routeId, params] = d.dispatch("GET", "/test/unknownPart123/21");

		evaluateStaticMatches(0, 200, status, routeId);
		evaluateDynamicMatches(params, ["id"], [21]);

		//try non number param
		[status] = d.dispatch("GET", "/test/unknownPart123/abc");
		assert.equal(status, 404);
	});

	it("should match with specific parameter", function() {
		const r = createNewRouteCollector(options);

		r.get("/(user|u)/:id", () => {
			return "test";
		});

		const d = createNewDispatcher(r, options);

		//try with u
		let [status, routeId, params] = d.dispatch("GET", "/u/21");

		evaluateStaticMatches(0, 200, status, routeId);
		evaluateDynamicMatches(params, ["id"], [21]);

		//try with user
		[status, routeId, params] = d.dispatch("GET", "/user/abc");
		evaluateStaticMatches(0, 200, status, routeId);
		evaluateDynamicMatches(params, ["id"], ["abc"]);
	});
}