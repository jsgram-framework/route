/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import RouteCollectorInterface from "./Interfaces/RouteCollectorInterface";
import DispatcherInterface from "./Interfaces/DispatcherInterface";
import GeneratorInterface from "./Interfaces/GeneratorInterface";
import RouteCollector from "./Collector/RouteCollector";
import Route from "./Route";
import RouteGroup from "./RouteGroup";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH" | "HEAD";

export type RouterOptions = {
	/**
	 * Path to the route generator.
	 *
	 * Must implement GeneratorInterface
	 *
	 * Must be compatible with the dispatcher
	 *
	 */
	generator?: string;

	/**
	 * Path to the route dispatcher
	 *
	 * Must implement the DispatcherInterface
	 *
	 * Must be compatible with the generator
	 */
	dispatcher?: string;

	/**
	 * Path to the route collector
	 *
	 * Must implement RouteCollectorInterface
	 */
	collector?: string;
};

export {DispatcherInterface, GeneratorInterface, RouteCollectorInterface, RouteCollector, Route, RouteGroup};

let routeCollector: RouteCollectorInterface;
let routeDispatcher: DispatcherInterface;
let dispatcherPath = "";

/**
 * Creates all parts of the router:
 * - generator to prepare the routes for the dispatching process
 * - dispatcher to match the routes with the path
 * - collector to collect the routes
 *
 * @param {RouterOptions} options
 * @returns {RouteCollectorInterface}
 */
export function router(options: RouterOptions = {}): RouteCollectorInterface {
	if (!routeCollector || process.env.NODE_ENV === "test") {
		let generatorPath;
		if (!options.generator) {
			generatorPath = "./Generator/Tree/TreeGenerator";
		} else {
			generatorPath = options.generator;
		}

		if (!options.dispatcher) {
			dispatcherPath = "./Dispatcher/Tree/TreeDispatcher";
		} else {
			dispatcherPath = options.dispatcher;
		}

		let routeCollectorPath;
		if (!options.collector) {
			routeCollectorPath = "./Collector/RouteCollector";
		} else {
			routeCollectorPath = options.collector;
		}

		const generator = require(generatorPath);

		const routeCollectorClass = require(routeCollectorPath);

		routeCollector = new routeCollectorClass.default(new generator.default());
	}

	return routeCollector;
}

/**
 * Returns the dispatcher with all generated routes
 *
 * call this function after the route collection
 *
 * @returns {DispatcherInterface}
 */
export function dispatcher(): DispatcherInterface {
	if (!routeDispatcher || process.env.NODE_ENV === "test") {
		const dispatcherClass = require(dispatcherPath);

		routeDispatcher = new dispatcherClass.default(routeCollector.getData());
	}

	return routeDispatcher;
}