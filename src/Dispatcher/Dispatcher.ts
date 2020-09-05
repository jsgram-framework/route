/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import DispatcherInterface from "../Interfaces/DispatcherInterface";
import {HttpMethod} from "../router";
import {StaticRoutes} from "../Interfaces/GeneratorInterface";

abstract class Dispatcher implements DispatcherInterface
{
	protected staticRoutes: StaticRoutes;

	/**
	 * Match die dynamic routes
	 *
	 * wie, wird vom jeweiligen dispatcher bestimmt
	 *
	 * @param {string} method
	 * @param {string} path
	 * @returns {[number , Map] | [number]}
	 */
	abstract dispatchDynamic(method: HttpMethod, path: string): [number,number,Map<string,any>] | [number];

	/**
	 * Erhalte die static routes und die dynamic
	 *
	 * Jeweils ihrer method zugeordnet
	 *
	 * @param {StaticRoutes} routes
	 */
	constructor(routes: StaticRoutes)
	{
		this.staticRoutes = routes;
	}

	/**
	 * @inheritDoc
	 *
	 * Wenn Response nicht gewfunden wurde prüfe zusätzlich auf 405 und 404
	 */
	public dispatch(method: HttpMethod, path: string): [number,number,Map<string,any>] | [number]
	{
		const response = this.doDispatch(method,path);

		if(response[0] === 200) {
			//route wurde gefunden
			return response;
		}

		if(method == 'HEAD') {
			//Prüfe bei HEAD auch GET routes
			return this.dispatch('GET',path);
		}

		return [404];
	}

	/**
	 * Führe den dispatch Prozess zu der geg. Method aus
	 *
	 * Prüfe zuerst static mit dem hasmap lookup
	 *
	 * Danach dynamic mithilfe des jeweiligen dynamic disaptcher
	 *
	 * @param {HttpMethod} method
	 * @param {string} path
	 * @returns {[number , Map<string, {any}>] | [number]}
	 */
	private doDispatch(method: HttpMethod, path: string): [number,number,Map<string,any>] | [number]
	{
		//prüfe zuerst static routes
		const check = this.staticRoutes.get(method);

		if(check && check.has(path)) {
			//route hat mit static routes gematcht
			return [200,check.get(path),new Map()];
		}

		//dispatch dynamic
		return this.dispatchDynamic(method,path);
	}
}

export default Dispatcher;