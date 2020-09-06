/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Route from "../Route";
import RouteGroup from "../RouteGroup";
import {HttpMethod} from "../router";

interface RouteCollectorInterface
{

	/**
	 * Füge eine Route hinzu und gebe die erstellte route wieder zurück
	 *
	 * @param {HttpMethod[]} methods
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	add(methods: HttpMethod[], path: string, handler: any): Route;

	/**
	 * Eine Gruppe gibt den prefix für routes vor.
	 *
	 * Dazu wird der Routecollector ausgeführt, um die in ihm erhaltenen routes hinzu zufügen
	 *
	 * @param {string} prefix
	 * @param {() => void} collector
	 * @returns {RouteGroup}
	 */
	group(prefix: string, collector: () => void): RouteGroup;

	/**
	 * Eine GET route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	get(path: string, handler: any): Route;

	/**
	 * POST Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	post(path: string, handler: any): Route;

	/**
	 * Method can either be Get or Post
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	getpost(path: string, handler: any): Route;

	/**
	 * PUT Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	put(path: string, handler: any): Route;

	/**
	 * PATCH Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	patch(path: string, handler: any): Route;

	/**
	 * HEAD Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	head(path: string, handler: any): Route;

	/**
	 * DELETE Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	delete(path: string, handler: any): Route;

	/**
	 * Options Route
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	options(path: string, handler: any): Route;

	/**
	 * Any Method
	 *
	 * @param {string} path
	 * @param handler
	 * @returns {Route}
	 */
	any(path: string, handler: any): Route;

	/**
	 * Gebe die genereiten Routes zurück
	 *
	 * für den dispatcher
	 *
	 * Das Rturn wird durch den jeweiligen Fenerator bestimmt
	 * deswegen any
	 *
	 * @returns {Array}
	 */
	getData(): any;

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