/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

class RouteGroup
{
	private static middleware: Map<number,any> = new Map();

	constructor(public groupId: number) {}

	public add(middleware:any)
	{
		RouteGroup.middleware.set(this.groupId,middleware);
	}

	public static getAllRouteMiddleware(groupId: number)
	{
		return RouteGroup.middleware.get(groupId);
	}
}

export default RouteGroup;