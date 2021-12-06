/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import GeneratorInterface, {StaticRoutes} from "../Interfaces/GeneratorInterface";
import Route from "../Route";
import {parse, Token} from "path-to-regexp";
import {HttpMethod} from "../router";

abstract class Generator implements GeneratorInterface
{
	protected staticRoutes: StaticRoutes = new Map();

	protected dynamicRoutes: Map<HttpMethod, Route[]> = new Map();

	/**
	 * Erstellt die Dynamic Routes
	 *
	 * Das Return hängt von dem jeweiligen Generator ab
	 * deswegen any
	 *
	 * @returns {any}
	 */
	protected abstract generateDynamic(): any;

	/**
	 * Bereitet die Route nach dem parsen vor
	 *
	 * Erhält die Route und das Ergebnis des Parsers
	 *
	 * @param {Route} route
	 * @param {Token[]} regexp
	 */
	protected abstract prepareDynamicRoute(route: Route, regexp: Token[]);

	/**
	 * @inheritDoc
	 *
	 * Die Routes werden getrennt ind static und dynamic und jeweils ihrer method zugeordnet
	 *
	 * die static routes haben den path als key und die route id als value
	 *
	 * die dynamic routes werden in regex und handler (die route id) unterteilt
	 * regex umfasst die zusammengesetzt regex der routes
	 * 
	 * wie diese aussieht wird vom jeweiligen generator bestimmt
	 */
	public generate(): [StaticRoutes, any]
	{
		return [
			this.staticRoutes,
			this.generateDynamic()
		];
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

		let type = 0;

		if (regexp.length === 1 && typeof regexp[0] === "string") {
			//static route
			type = 0;
		} else {
			//dynamic route
			type = 1;

			this.prepareDynamicRoute(route, regexp);
		}

		//trenne route in static und dynamic

		for (let i = 0; i < route.methods.length; i++) {
			const method = route.methods[i];

			if (type == 0) {
				/**
				 * Static Route
				 *
				 * Speichere diese in einer HashMap
				 * als keys die method und in method der path, als value die id
				 *
				 * functionsweise: wenn method get ist: gehe bei method zu get und dann gehe zum path
				 */

				if (!this.staticRoutes.has(method)) {
					//route method wurde noch nicht eingetragen
					//erstelle neue map
					const staticMap = new Map();
					staticMap.set(route.path, route.routeId);	//die static route in der route map

					this.staticRoutes.set(method, staticMap);
				} else {
					this.staticRoutes.get(method).set(route.path, route.routeId);
				}
			} else if (type == 1) {
				if (!this.dynamicRoutes.has(method)) {
					this.dynamicRoutes.set(method, [route]);
				} else {
					this.dynamicRoutes.get(method).push(route);
				}
			}
		}
	}
}

export default Generator;