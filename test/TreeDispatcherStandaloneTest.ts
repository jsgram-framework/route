import {testDispatcher} from "./DispatcherClass";
import {routeTest} from "./RouteClass";
import {RouterOptions} from "../src/router";

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