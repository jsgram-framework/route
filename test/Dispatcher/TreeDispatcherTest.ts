import {testDispatcher} from "../DispatcherClass";
import {routeTest} from "../RouteClass";
import {RouterOptions} from "../../src/router";
import {createNewDispatcher, createNewRouteCollector} from "../helper";
import {assert} from "chai";
import {testDispatcherExt} from "../DispatcherClassExt";
import TreeGenerator from "../../src/Generator/Tree/TreeGenerator";
import TreeDispatcher from "../../src/Dispatcher/Tree/TreeDispatcher";

const options:RouterOptions = {
	getGenerator: () => {
		return new TreeGenerator();
	},
	getDisPatcher: (collector) => {
		return new TreeDispatcher(collector.getData());
	}
};

describe("TreeDispatcher", () => {
	testDispatcher(options);

	testDispatcherExt(options);

	it("should throw assert error because of trying to insert the same route", function() {
		const r = createNewRouteCollector(options);

		r.get("/test/:id", () => {
			return "test";
		});

		r.get("/test/:id", () => {
			return "test";
		});

		assert.throws(() => {
			createNewDispatcher(r, options);
		}, "");

	});
});

describe("TreeDispatcherRouteTest", () => {
	routeTest(options);
});