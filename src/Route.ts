/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

class Route
{
	private static middleware: Map<number,any> = new Map();

	public vars: object[];

	constructor(
		public methods:string[],
		public path:string,
		public routeId:number,
		public routeGroupIds:number[],
		public handler:any
	) {}

	public add(middleware:any)
	{
		Route.middleware.set(this.routeId,middleware);
	}

	public static getRouteMiddleware(routeId: number)
	{
		return Route.middleware.get(routeId);
	}
}

export default Route;