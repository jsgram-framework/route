/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Route from "../Route";
import RouteGroup from "../RouteGroup";

interface RouteCollectorInterface
{

	/**
	 * Füge eine Route hinzu und gebe die erstellte route wieder zurück
	 *
	 * @param {string[]} methods
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	add(methods:string[], path:string, handler:any): Route;

	/**
	 * Eine Gruppe gibt den prefix für routes vor.
	 *
	 * Dazu wird der Routecollector ausgeführt, um die in ihm erhaltenen routes hinzu zufügen
	 *
	 * @param {string} prefix
	 * @param collector
	 * @returns {RouteGroup}
	 */
	group(prefix: string, collector): RouteGroup;

	/**
	 * Eine GET route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	get(path:string, handler:any): Route;

	/**
	 * POST Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	post(path:string, handler:any): Route;

	/**
	 * Gebe die genereiten Routes zurück
	 *
	 * für den dispatcher
	 *
	 * @returns {Array}
	 */
	getData(): [Map<string, Map<string,number>>, Map<string,any>];

	/**
	 * Gebe eine bestimmte Route zurück
	 *
	 * wird genutzt um infos über die gematchte route zu erhalten
	 *
	 * @param {number} id
	 * @returns {Route}
	 */
	getRoute(id: number): Route;
}


export default RouteCollectorInterface;