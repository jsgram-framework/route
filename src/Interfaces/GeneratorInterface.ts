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
	 * Die Routes werden getrennt ind static und dynamic und jeweils ihrer method zugeordnet
	 *
	 * die static routes haben den path als key und die route id als value
	 *
	 * die dynamic routes werden in regex und handler (die route id) unterteilt
	 * regex umfasst die zusammengesetzt regex der routes
	 * wie diese aussieht wird vom jeweiligen generator bestimmt
	 *
	 * @returns {[StaticRoutes, any]}
	 */
	generate(): [StaticRoutes, any];

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