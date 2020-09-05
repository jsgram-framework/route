import {testDispatcher} from "./DispatcherClass";
import {routeTest} from "./RouteClass";
import {RouterOptions} from "../src/router";

const options:RouterOptions = {
	generator:"../src/Generator/RegexBased/GroupPosBased",
	dispatcher:"../src/Dispatcher/RegexBased/GroupPosBased"
};

describe("GroupPosBasedDispatcher",() => {
	testDispatcher(options);
});

describe("GroupPosBasedDispatcherRouteTest",() => {
	routeTest(options);
});