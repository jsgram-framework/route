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
import TreeGenerator from "./Generator/Tree/TreeGenerator";
import TreeDispatcher from "./Dispatcher/Tree/TreeDispatcher";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH" | "HEAD";

export type RouterOptions = {
	getGenerator?: () => GeneratorInterface;

	getCollector?: (generator: GeneratorInterface) => RouteCollectorInterface;

	getDisPatcher?: (collector: RouteCollectorInterface) => DispatcherInterface;
};

export {DispatcherInterface, GeneratorInterface, RouteCollectorInterface, RouteCollector, Route, RouteGroup};

let routeCollector: RouteCollectorInterface;
let routeDispatcher: DispatcherInterface;
let getDispatcher: (collector: RouteCollectorInterface) => DispatcherInterface;

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
		let generator: GeneratorInterface;

		if (options?.getGenerator) {
			generator = options.getGenerator();
		} else {
			generator = new TreeGenerator();
		}

		if (options?.getCollector) {
			routeCollector = options.getCollector(generator);
		} else {
			routeCollector = new RouteCollector(generator);
		}

		if (options?.getDisPatcher) {
			getDispatcher = options.getDisPatcher;
		} else {
			getDispatcher = (collector) => {
				return new TreeDispatcher(collector.getData());
			};
		}
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
		routeDispatcher = getDispatcher(routeCollector);
	}

	return routeDispatcher;
}