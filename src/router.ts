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

export * from "./Collector/RouteCollector";
export * from "./Dispatcher/Dispatcher";
export * from "./Dispatcher/RegexBased/GroupPosBased";
export * from "./Dispatcher/RegexBased/RegexBasedDispatcher";
export * from "./Dispatcher/Tree/TreeDispatcher";
export * from "./Dispatcher/Tree/TreeDispatcherStandalone";
export * from "./Generator/Tree/Node";
export * from "./Generator/Tree/TreeGenerator";
export * from "./Generator/Tree/TreeGeneratorStandalone";
export * from "./Generator/Generator";
export * from "./Generator/RegexBased/GroupPosBased";
export * from "./Generator/RegexBased/RegexBasedGenerator";
export * from "./Interfaces/DispatcherInterface";
export * from "./Interfaces/GeneratorInterface";
export * from "./Interfaces/RouteCollectorInterface";

let routeCollector: RouteCollectorInterface;
let routeDispatcher: DispatcherInterface;
let dispatcherPath: string = "";

/**
 * Creates all parts of the router:
 * - generator to prepare the routes for the dispatching process
 * - dispatcher to match the routes with the path
 * - collector to collect the routes
 *
 * @param {RouterOptions} options
 * @returns {RouteCollectorInterface}
 */
function router(options: RouterOptions = {}): RouteCollectorInterface {
	if(!routeCollector) {
		let generatorPath;
		if(!options.generator) {
			generatorPath = "./Generator/Tree/TreeGenerator";
		} else {
			generatorPath = options.generator;
		}

		if(!options.dispatcher) {
			dispatcherPath = "./Dispatcher/Tree/TreeDispatcher";
		} else {
			dispatcherPath = options.dispatcher;
		}

		let routeCollectorPath;
		if(!options.collector) {
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
function dispatcher(): DispatcherInterface {
	if(!routeDispatcher) {
		let dispatcherClass = require(dispatcherPath);

		routeDispatcher = new dispatcherClass.default(routeCollector.getData());
	}

	return routeDispatcher;
}

export {router,dispatcher};