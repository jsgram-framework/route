import {evaluateDynamicMatches, evaluateStaticMatches, testDispatcher} from "./DispatcherClass";
import {routeTest} from "./RouteClass";
import {RouterOptions} from "../src/router";
import {createNewDispatcher, createNewRouteCollector} from "./helper";

const options:RouterOptions = {
	generator:"../src/Generator/Tree/TreeGeneratorStandalone",
	dispatcher:"../src/Dispatcher/Tree/TreeDispatcherStandalone"
};

describe("TreeDispatcherStandalone",() => {
	//testDispatcher(options);

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
});



//TODO internal errors checking