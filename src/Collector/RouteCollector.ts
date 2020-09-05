/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import RouteCollectorInterface from "../Interfaces/RouteCollectorInterface";
import Route from "../Route";
import GeneratorInterface, {StaticRoutes} from "../Interfaces/GeneratorInterface";
import RouteGroup from "../RouteGroup";
import {HttpMethod} from "../router";

class RouteCollector implements RouteCollectorInterface
{
	protected base: string = "";

	protected prefix: string = "";

	protected routeId: number = 0;

	protected routeGroupId: number = 0;

	protected routeGroupIds: number[] = [0];

	protected routes: Map<number,Route> = new Map();

	constructor(private generator: GeneratorInterface) {}

	/**
	 * @inheritDoc
	 */
	public add(methods: HttpMethod[], path: string, handler: any): Route
	{
		//neuer path mit base und prefix (von der group)
		path = this.base + this.prefix + path;

		const route = this.createRoute(methods,path,handler);

		this.routes.set(this.routeId,route);

		//gebe die route zum generieren dem generator
		//kann in node genutzt werden, da hier die routes nicht gecacht werden müssen
		this.generator.mapRoute(route);

		++this.routeId;

		return route;
	}

	/**
	 * @inheritDoc
	 *
	 * Sichere zuerst die alten werte
	 *
	 * Update die werte: prefix, groupid und füge die neue groupId den anderen groups hinzu
	 *
	 * erstelle eine group mit der groupid
	 *
	 * führe den collector aus um die routes ind er group zu sammeln
	 * diese werden dann mit dem neuen prefix und der neuen groupid im group array gesetzt
	 *
	 * stelle zum schluss alle werte wiederher
	 * und gebe die erstelle group zurück
	 */
	public group(prefix: string, collector: () => void): RouteGroup
	{
		//alte werte sichern zum wiederherstellen
		const pre = this.prefix;
		const oldGroupIds = [... this.routeGroupIds];	//kopiere die derzeiten werte

		this.prefix += prefix;
		++this.routeGroupId;
		this.routeGroupIds.push(this.routeGroupId);

		const group = new RouteGroup(this.routeGroupId);

		//sammle die routes in der group ein
		collector();

		//stelle alte werte wieder her
		this.prefix = pre;
		this.routeGroupIds = [... oldGroupIds];	//gebe die kopier wieder zurück

		return group;
	}

	/**
	 * @inheritDoc
	 */
	public get(path: string, handler: any): Route
	{
		return this.add(["GET"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public post(path: string, handler: any): Route
	{
		return this.add(["POST"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public getpost(path: string, handler: any): Route
	{
		return this.add(["GET","POST"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public put(path: string, handler: any): Route
	{
		return this.add(["PUT"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public patch(path: string, handler: any): Route
	{
		return this.add(["PATCH"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public head(path: string, handler: any): Route
	{
		return this.add(["HEAD"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public delete(path: string, handler: any): Route
	{
		return this.add(["DELETE"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public options(path: string, handler: any): Route
	{
		return this.add(["OPTIONS"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public any(path: string, handler: any): Route
	{
		return this.add(["GET","POST","PUT","DELETE","OPTIONS","PATCH","HEAD"],path,handler);
	}

	/**
	 * @inheritDoc
	 */
	public getData(): [StaticRoutes, any]
	{
		return this.generator.generate();
	}

	/**
	 * @inheritDoc
	 */
	public getRoute(id: number): Route
	{
		return this.routes.get(id);
	}

	/**
	 * Creates a new Route
	 *
	 * This method can be override by a child class of RouteCollector
	 * to create another Route Class
	 *
	 * @param {HttpMethod[]} methods
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	protected createRoute(methods: HttpMethod[], path: string, handler: any): Route
	{
		return new Route(
			methods,
			path,
			this.routeId,
			[... this.routeGroupIds],
			handler
		);
	}
}

export default RouteCollector;