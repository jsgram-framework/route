import {testDispatcher} from "../DispatcherClass";
import {routeTest} from "../RouteClass";
import {RouterOptions} from "../../src/router";
import {testDispatcherExt} from "../DispatcherClassExt";

const gpG = require("../../src/Generator/RegexBased/GroupPosBased");
const gpD = require("../../src/Dispatcher/RegexBased/GroupPosBased");

const options:RouterOptions = {
	getGenerator: () => {
		return new gpG.default();
	},
	getDisPatcher: (collector) => {
		return new gpD.default(collector.getData());
	}
};

describe("GroupPosBasedDispatcher", () => {
	testDispatcher(options);

	testDispatcherExt(options);
});

describe("GroupPosBasedDispatcherRouteTest", () => {
	routeTest(options);
});