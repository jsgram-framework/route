/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Route from "../Route";

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
	 * @returns {[Map<string, Map<string, number>> , Map<string, {any}>]}
	 */
	generate(): [Map<string, Map<string,number>>, Map<string,any>];

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