import {testDispatcher} from "../DispatcherClass";
import {routeTest} from "../RouteClass";
import {RouterOptions} from "../../src/router";
import {testDispatcherExt} from "../DispatcherClassExt";

const options:RouterOptions = {
	generator:"../src/Generator/RegexBased/GroupPosBased",
	dispatcher:"../src/Dispatcher/RegexBased/GroupPosBased"
};

describe("GroupPosBasedDispatcher",() => {
	testDispatcher(options);

	testDispatcherExt(options);
});

describe("GroupPosBasedDispatcherRouteTest",() => {
	routeTest(options);
});