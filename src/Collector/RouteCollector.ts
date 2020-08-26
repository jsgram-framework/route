/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import RouteCollectorInterface from "../Interfaces/RouteCollectorInterface";
import Route from "../Route";
import GeneratorInterface from "../Interfaces/GeneratorInterface";
import RouteGroup from "../RouteGroup";

class RouteCollector implements RouteCollectorInterface
{
	protected base: string = "";

	protected prefix: string = "";

	protected routeId:number = 0;

	protected routeGroupId:number = 0;

	protected routeGroupIds: number[] = [0];

	protected routes: Map<number,Route> = new Map();

	constructor(private generator: GeneratorInterface) {}

	/**
	 * @inheritDoc
	 */
	public add(methods: string[], path: string, handler: any): Route
	{
		//neuer path mit base und prefix (von der group)
		//path = this.base.concat(this.prefix,path.toString());

		path = this.base + this.prefix + path;

		let route = new Route(methods,path,this.routeId,[... this.routeGroupIds],handler);

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
		let pre = this.prefix;
		let oldGroupIds = [... this.routeGroupIds];	//kopiere die derzeiten werte

		this.prefix += prefix;
		++this.routeGroupId;
		this.routeGroupIds.push(this.routeGroupId);

		let group = new RouteGroup(this.routeGroupId);

		//sammle die routes ind er group ein
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
	public getData(): [Map<string, Map<string,number>>, Map<string,any>]
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

}

export default RouteCollector;