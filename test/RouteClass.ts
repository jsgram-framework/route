import {assert} from "chai";
import {RouterOptions} from "../src/router";
import {createNewDispatcher, createRouteMap} from "./helper";
import Route from "../src/Route";
import {MockRouteGroup} from "./MockrouteGroup";

function evaluateMiddleware(route: Route, expectResult: string[] = []) {
	const mws = route.getMiddleware();

	let i = 0;
	for (let mw of mws) {
		assert.equal(mw(),expectResult[i]);

		++i;
	}
}

export function routeTest(options: RouterOptions = {}) {
	it('should get a Route', function () {
		const r = createRouteMap(options);

		const d = createNewDispatcher(r);

		const path = "/test1/21";
		const method = "GET";

		let [status,routeId] = d.dispatch(method,path);

		const route = r.getRoute(routeId);

		const result = route.handler();

		assert.equal(result,"matched GET dynamic");
		assert.equal(status,200);
	});

	it('should get Route Middleware', function () {
		const r = createRouteMap(options,2);

		const d = createNewDispatcher(r);

		const path = "/routeMw1";
		const method = "GET";

		const [status,routeId] = d.dispatch(method,path);

		const route = r.getRoute(routeId);

		evaluateMiddleware(route,["routeMw1"]);

		assert.equal(status,200);

		MockRouteGroup.overrideMw();
	});

	it('should get Route and Group Middleware', function () {
		const r = createRouteMap(options,2);

		const d = createNewDispatcher(r);

		const path = "/mwGroup1/routeMw2";
		const method = "GET";

		const [status,routeId] = d.dispatch(method,path);

		const route = r.getRoute(routeId);

		evaluateMiddleware(route,["mwGroup1","routeMw2"]);

		assert.equal(status,200);

		MockRouteGroup.overrideMw();
	});

	it('should get Route and Group Middleware from nested group', function () {
		const r = createRouteMap(options,2);

		const d = createNewDispatcher(r);

		const path = "/mwGroup1/mwGroup2/mwGroup3/routeMw4";
		const method = "GET";

		const [status,routeId] = d.dispatch(method,path);

		const route = r.getRoute(routeId);

		evaluateMiddleware(route,["mwGroup1","mwGroup2",'mwGroup3','mwGroup3.1','routeMw4',"routeMw4.1"]);

		assert.equal(status,200);

		MockRouteGroup.overrideMw();
	});
}