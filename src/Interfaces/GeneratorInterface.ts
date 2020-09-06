/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Route from "../Route";
import {HttpMethod} from "../router";

export type StaticRoutes = Map<HttpMethod, Map<string,number>>;

interface GeneratorInterface
{
	/**
	 * Erstelle die Route Map
	 *
	 * Wie diese aussieht deinifert der jeweilige Generator
	 *
	 * Deswegen wird any zurück gegeben
	 *
	 * @returns {any}
	 */
	generate(): any;

	/**
	 * füge eine Route der collection hinzu
	 *
	 * füge sie in static oder dynamic routes ein
	 *
	 * @param {Route} route
	 */
	mapRoute(route: Route): void;
}

export default GeneratorInterface;