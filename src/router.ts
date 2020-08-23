import RouteCollectorInterface from "./Interfaces/RouteCollectorInterface";
import DispatcherInterface from "./Interfaces/DispatcherInterface";

let routeCollector: RouteCollectorInterface;
let routeDispatcher: DispatcherInterface;
let dispatcherPath: string = "";

function router(options: Map<string,string> = new Map): RouteCollectorInterface {
	if(!routeCollector) {
		let generatorPath = "";
		if(options.has('generator')) {
			generatorPath = options.get('generator');
		} else {
			generatorPath = "./Generator/GroupPosBased";
		}

		if(options.has('dispatcher')) {
			dispatcherPath = options.get('dispatcher');
		} else {
			dispatcherPath = "./Dispatcher/GroupPosBased";
		}

		let routeCollectorPath = "";
		if(options.has('collector')) {
			routeCollectorPath = options.get('collector');
		} else {
			routeCollectorPath = "./Collector/RouteCollector";
		}

		const generator = require(generatorPath);

		const routeCollectorClass = require(routeCollectorPath);

		routeCollector = new routeCollectorClass.default(new generator.default());
	}

	return routeCollector;
}

function dispatcher(): DispatcherInterface {
	if(!routeDispatcher) {
		let dispatcherClass = require(dispatcherPath);

		routeDispatcher = new dispatcherClass.default(routeCollector.getData());
	}

	return routeDispatcher;
}

export {router,dispatcher};