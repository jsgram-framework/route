import {testDispatcher} from "../DispatcherClass";
import {routeTest} from "../RouteClass";
import {RouterOptions} from "../../src/router";
import {createNewDispatcher, createNewRouteCollector} from "../helper";
import {assert} from "chai";
import {testDispatcherExt} from "../DispatcherClassExt";

const options:RouterOptions = {
	generator:"../src/Generator/Tree/TreeGenerator",
	dispatcher:"../src/Dispatcher/Tree/TreeDispatcher"
};

describe("TreeDispatcher",() => {
	testDispatcher(options);

	testDispatcherExt(options);

	it('should throw assert error because of trying to insert the same route', function () {
		const r = createNewRouteCollector(options);

		r.get("/test/:id",() => {
			return "test";
		});

		r.get("/test/:id",() => {
			return "test";
		});

		assert.throws(() => {
			createNewDispatcher(r,options);
		},"");

	});
});

describe("TreeDispatcherRouteTest",() => {
	routeTest(options);
});