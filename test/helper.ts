import {RouterOptions} from "../src/router";
import RouteCollectorInterface from "../src/Interfaces/RouteCollectorInterface";

export function createNewRouteCollector(options: RouterOptions = {}): RouteCollectorInterface
{
	let generatorPath = "";
	if(!options.generator) {
		generatorPath = "../src/Generator/GroupPosBased";
	} else {
		generatorPath = options.generator;
	}

	let routeCollectorPath = "";
	if(!options.collector) {
		routeCollectorPath = "../src/Collector/RouteCollector";
	} else {
		routeCollectorPath = options.collector;
	}

	const generator = require(generatorPath);

	const routeCollectorClass = require(routeCollectorPath);

	return new routeCollectorClass.default(new generator.default());
}

export function createNewDispatcher(collector: RouteCollectorInterface, options: RouterOptions = {}) {
	let dispatcherPath = "";

	if(!options.dispatcher) {
		dispatcherPath = "../src/Dispatcher/GroupPosBased";
	} else {
		dispatcherPath = options.dispatcher;
	}

	let dispatcherClass = require(dispatcherPath);

	return new dispatcherClass.default(collector.getData());
}