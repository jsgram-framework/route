import RouteCollectorInterface from "./Interfaces/RouteCollectorInterface";
import DispatcherInterface from "./Interfaces/DispatcherInterface";

export type httpMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH" | "HEAD";

export type routerOptions = {
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

let routeCollector: RouteCollectorInterface;
let routeDispatcher: DispatcherInterface;
let dispatcherPath: string = "";

/**
 * Creates all parts of the router:
 * - generator to prepare the routes for the dispatching process
 * - dispatcher to match the routes with the path
 * - collector to collect the routes
 *
 * @param {routerOptions} options
 * @returns {RouteCollectorInterface}
 */
function router(options: routerOptions = {}): RouteCollectorInterface {
	if(!routeCollector) {
		let generatorPath = "";
		if(!options.generator) {
			generatorPath = "./Generator/GroupPosBased";
		} else {
			generatorPath = options.generator;
		}

		if(!options.dispatcher) {
			dispatcherPath = "./Dispatcher/GroupPosBased";
		} else {
			dispatcherPath = options.dispatcher;
		}

		let routeCollectorPath = "";
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