import {testDispatcher} from "../DispatcherClass";
import {routeTest} from "../RouteClass";
import {RouterOptions} from "../../src/router";
import TreeGeneratorStandalone from "../../src/Generator/Tree/TreeGeneratorStandalone";
import TreeDispatcherStandalone from "../../src/Dispatcher/Tree/TreeDispatcherStandalone";

const options:RouterOptions = {
	getGenerator: () => {
		return new TreeGeneratorStandalone();
	},
	getDisPatcher: (collector) => {
		return new TreeDispatcherStandalone(collector.getData());
	}
};


describe("TreeDispatcherStandalone", () => {
	testDispatcher(options);
});


describe("TreeDispatcherStandaloneRouteTest", () => {
	routeTest(options);
});