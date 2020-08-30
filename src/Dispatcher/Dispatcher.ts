/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import DispatcherInterface from "../Interfaces/DispatcherInterface";
import {HttpMethod} from "../router";

abstract class Dispatcher implements DispatcherInterface
{
	protected staticRoutes: Map<HttpMethod, Map<string,number>>;

	protected dynamicRoutesRegex: Map<HttpMethod, any[]>;

	protected dynamicRoutesHandler: Map<HttpMethod, any[]>;

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
	 * @param {[Map<HttpMethod, Map<string,number>>, Map<string, Map<HttpMethod, []>>]} routes
	 */
	constructor(routes: [Map<HttpMethod, Map<string,number>>, Map<string, Map<HttpMethod, any[]>>])
	{
		this.staticRoutes = routes[0];

		let dynamic: Map<string,any>;

		dynamic = routes[1];

		this.dynamicRoutesRegex = dynamic.get('regex');
		this.dynamicRoutesHandler = dynamic.get('dynamichandler');
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

		if(false === this.dynamicRoutesRegex.has(method)) {
			//es die method nicht bei den dynamic routes
			return [404];
		}

		//dispatch dynamic
		return this.dispatchDynamic(method,path);
	}
}

export default Dispatcher;