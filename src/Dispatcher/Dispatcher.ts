/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import DispatcherInterface from "../Interfaces/DispatcherInterface";
import {httpMethod} from "../router";

abstract class Dispatcher implements DispatcherInterface
{
	protected staticRoutes: Map<httpMethod, Map<string,number>>;

	protected dynamicRoutesRegex: Map<httpMethod, any[]>;

	protected dynamicRoutesHandler: Map<httpMethod, any[]>;

	/**
	 * Match die dynamic routes
	 *
	 * wie, wird vom jeweiligen dispatcher bestimmt
	 *
	 * @param {string} method
	 * @param {string} path
	 * @returns {[number , Map] | [number]}
	 */
	abstract dispatchDynamic(method: httpMethod, path: string): [number,number,Map<string,any>] | [number];

	/**
	 * Erhalte die static routes und die dynamic
	 *
	 * Jeweils ihrer method zugeordnet
	 *
	 * @param {[Map<httpMethod, Map<string,number>>, Map<string, Map<httpMethod, []>>]} routes
	 */
	constructor(routes: [Map<httpMethod, Map<string,number>>, Map<string, Map<httpMethod, any[]>>])
	{
		if(!routes[0]) {
			//keine static routes
			this.staticRoutes = new Map();
		} else {
			this.staticRoutes = routes[0];
		}

		let dynamic: Map<string,any>;

		if(!routes[1]) {
			//keine dynamic Routes
			this.dynamicRoutesRegex = new Map();
			this.dynamicRoutesHandler = new Map();
		} else {
			dynamic = routes[1];

			this.dynamicRoutesRegex = dynamic.get('regex');
			this.dynamicRoutesHandler = dynamic.get('dynamichandler');
		}
	}

	/**
	 * @inheritDoc
	 *
	 * Wenn Response nicht gewfunden wurde prüfe zusätzlich auf 405 und 404
	 */
	public dispatch(method: httpMethod, path: string): [number,number,Map<string,any>] | [number]
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

		//prüfe auf 405
		//TODO prüfe auf 405

		return [404];
	}

	/**
	 * Führe den dispatch Prozess zu der geg. Method aus
	 *
	 * Prüfe zuerst static mit dem hasmap lookup
	 *
	 * Danach dynamic mithilfe des jeweiligen dynamic disaptcher
	 *
	 * @param {httpMethod} method
	 * @param {string} path
	 * @returns {[number , Map<string, {any}>] | [number]}
	 */
	private doDispatch(method: httpMethod, path: string): [number,number,Map<string,any>] | [number]
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