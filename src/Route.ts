/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import RouteGroup from "./RouteGroup";
import {HttpMethod} from "./router";

class Route
{
	protected middleware: any[] = [];

	public vars: number[] | string[];

	public regexParts: Map<string | number, RegExp> = new Map();

	constructor(
		public methods: HttpMethod[],
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
	protected prepareRoute()
	{
		const groupMws: any[] = [];

		for (let i = 0; i < this.routeGroupIds.length; i++) {
			const groupMw = RouteGroup.getAllRouteMiddleware(this.routeGroupIds[i]);

			if (groupMw) {
				groupMws.push(... groupMw);
			}
		}

		//stelle die group mw voran, da diese zuerst ausgeführt werden müssen, packe den handler als letztes
		this.middleware = [... groupMws, ... this.middleware];
	}

	/**
	 * prepare the route before starting the server
	 */
	public build()
	{
		this.prepareRoute();
	}

	/**
	 * Gebe alle Middleware der Route zurück, inkl dem Handler
	 *
	 * @returns {[]}
	 */
	public getMiddleware(): any[]
	{
		return this.middleware;
	}
}

export default Route;