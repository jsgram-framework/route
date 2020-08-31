/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import GeneratorInterface from "../Interfaces/GeneratorInterface";
import Route from "../Route";
import {parse, Token} from "path-to-regexp";
import {HttpMethod} from "../router";

abstract class Generator implements GeneratorInterface
{
	protected staticRoutes: Map<HttpMethod, Map<string,number>> = new Map();

	protected dynamicRoutes: Map<HttpMethod, Route[]> = new Map();

	/**
	 * Die regex aller Dynamic Routes
	 * geordnet nach ihrer method
	 *
	 * Wie das Array angeordnet ist bestimmt der jeweilige Generator
	 *
	 * @type {Map}
	 */
	protected dynamicRouteList: Map<HttpMethod, any[]> = new Map();

	/**
	 * Alle Handler (Route Id) der Dynamic Routes
	 * geordnet nach ihrer Method
	 *
	 * Wie das Array angeordnet ist bestimmt der jeweilige Generator
	 *
	 * @type {Map}
	 */
	protected handlerList: Map<HttpMethod, any[]> = new Map();

	/**
	 * Gebe an wie viele Items in einen Chunk dürfen
	 * chuck size
	 *
	 * @returns {number}
	 */
	abstract getChunkSize(): number;

	/**
	 * Erstelle die Chunks und sortiere die chunks in die jeweilige Method ein
	 *
	 * Unterteile zudem in regex und Handler
	 *
	 * @param {Route[]} chunk
	 * @param {HttpMethod} method
	 */
	abstract chunkRoutes(chunk: Route[],method: HttpMethod);

	/**
	 * @inheritDoc
	 */
	public generate(): [Map<HttpMethod, Map<string,number>>, Map<string, Map<HttpMethod, any[]>>]
	{
		return [
			this.staticRoutes,
			this.generateDynamic()
		]
	}

	/**
	 * Parse die Regex der Route mithilfe von path-to-regexp
	 *
	 * und sortiere, je nachdem ob es placeholder gibt, in static oder dynamic
	 *
	 * @param {Route} route
	 */
	public mapRoute(route: Route)
	{
		const regexp: Token[] = parse(route.path);

		let type:number = 0;

		if(regexp.length === 1 && typeof regexp[0] === 'string') {
			//static route
			type = 0;
		} else {
			//dynamic route
			type = 1;
			let [path, vars] = Generator.createRoute(regexp);

			route.path = path;	//gebe den geparsten path der route
			route.vars = vars;	//die gefunden vars mit name
		}

		//trenne route in static und dynamic

		for(let method of route.methods) {
			if(type == 0) {
				/**
				 * Static Route
				 *
				 * Speichere diese in einer HashMap
				 * als keys die method und in method der path, als value die id
				 *
				 * functionsweise: wenn method get ist: gehe bei method zu get und dann gehe zum path
				 */

				if(!this.staticRoutes.has(method)) {
					//route method wurde noch nicht eingetragen
					//erstelle neue map
					let staticMap = new Map();
					staticMap.set(route.path,route.routeId);	//die static route in der route map

					this.staticRoutes.set(method,staticMap);
				} else {
					this.staticRoutes.get(method).set(route.path,route.routeId);
				}
			} else if(type == 1) {
				if(!this.dynamicRoutes.has(method)) {
					this.dynamicRoutes.set(method,[route]);
				} else {
					this.dynamicRoutes.get(method).push(route);
				}
			}
		}
	}

	/**
	 * Füge die einzelnen parts der static route zusammen
	 *
	 * tausche zudem / mit \/ aus
	 *
	 * @param {Token[]} data
	 * @returns {[string,number[]|string[]]}
	 */
	protected static createRoute(data: Token[]): [string,number[]|string[]]
	{
		let path: string = "";

		let vars: number[]|string[]|any[] = [];

		for (let datum of data) {
			if(typeof datum === 'string') {
				//static teil der route
				path += datum.replace(/\//g, '\\/');

				continue;
			}

			if(datum !== null && typeof datum === 'object') {
				//parameter teil
				vars.push(datum.name); //name des objects von path-to-regexp
				path += datum.prefix.replace(/\//g, '\\/') + '(' + datum.pattern + ')';
			}
		}

		return [path,vars];
	}

	protected generateDynamic(): Map<string, Map<HttpMethod, any[]>>
	{
		//iteriere über jede method
		for(let [method,routes] of Array.from(this.dynamicRoutes.entries())) {
			let chunkSize = Generator.generateChunkSize(routes.length,this.getChunkSize());

			//array chunk
			for (let i = 0, j = routes.length; i < j; i += chunkSize) {
				this.chunkRoutes(routes.slice(i,i+chunkSize),method);
			}
		}

		return new Map([
			["regex",this.dynamicRouteList],
			["dynamichandler",this.handlerList]
		])
	}

	protected static generateChunkSize(count:number, chunkSize:number): number
	{
		let approxChunks = Math.max(1,Math.round(count/chunkSize));	//wie viele Chunks lassen sich erstellen (muss min. einen geben)

		return Math.ceil(count/approxChunks);
	}
}

export default Generator;