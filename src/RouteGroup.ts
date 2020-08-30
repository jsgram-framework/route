/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

class RouteGroup
{
	protected static middleware: Map<number,any[]> = new Map();

	constructor(public groupId: number) {}

	/**
	 * Füge eine Middleware hinzu
	 *
	 * Middleware kann alles sein
	 *
	 * @param middleware
	 * @returns {this}
	 */
	public add(middleware: any)
	{
		if(!RouteGroup.middleware.has(this.groupId)) {
			//lege neues Array an
			RouteGroup.middleware.set(this.groupId,[middleware]);
		} else {
			RouteGroup.middleware.get(this.groupId).push(middleware);
		}

		return this;
	}

	/**
	 * Gebe alle Middleware für eine Route Group id zurück
	 *
	 * @param {number} groupId
	 * @returns {[]}
	 */
	public static getAllRouteMiddleware(groupId: number): any[]
	{
		return RouteGroup.middleware.get(groupId);
	}
}

export default RouteGroup;