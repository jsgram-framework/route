/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import RouteGroup from "./RouteGroup";
import {httpMethod} from "./router";

class Route
{
	private middleware: any[] = [];

	private createRouteStack: boolean = false;

	public vars: number[]|string[];

	constructor(
		public methods: httpMethod[],
		public path: string,
		public routeId: number,
		public routeGroupIds: number[],
		public handler: any
	) {}

	public add(middleware: any)
	{
		//route eigene Middleware
		this.middleware.push(middleware);

		return this;
	}

	/**
	 * Erstelle den Middleware Stack zur Runtime
	 * (aber nur ein mal, sollte der Stack noch nicht erstellt sein)
	 *
	 * Hole alle GroupMw und packe diese vor die route mw
	 */
	public prepareRoute()
	{
		let groupMws: any[] = [];

		for (let groupId of this.routeGroupIds) {
			const groupMw = RouteGroup.getAllRouteMiddleware(groupId);

			groupMws.push(... groupMw);
		}

		//stelle die group mw voran, da diese zuerst ausgeführt werden müssen, packe den handler als letztes
		this.middleware = [... groupMws, ... this.middleware];

		this.createRouteStack = true;
	}

	/**
	 * Gebe alle Middleware der Route zurück, inkl dem Handler
	 *
	 * Der Route Stack wird nur einmal erstellt,
	 * danach wird er in der Route gespeichert und nur noch abgerufen
	 *
	 * @returns {[]}
	 */
	public getMiddleware(): any[]
	{
		if(!this.createRouteStack) {
			//wenn route noch erstellt werden muss
			this.prepareRoute();
		}

		return this.middleware;
	}
}

export default Route;