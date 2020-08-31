/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Generator from "./Generator";
import Route from "../Route";
import {HttpMethod} from "../router";

/**
 * Based on:
 * @link http://nikic.github.io/2014/02/18/Fast-request-routing-using-regular-expressions.html
 * @link https://github.com/nikic/FastRoute
 */
class GroupPosBased extends Generator
{
	/**
	 * @inheritDoc
	 */
	getChunkSize(): number
	{
		return 10;
	}

	/**
	 * @inheritDoc
	 *
	 * Baue die Map zu zusammen:
	 *
	 * ^(?:
	 * 		|staticpart\/(regex)
	 * 		|staticpart\/(regex)
	 * 	)$
	 *
	 * Handler wird dem offset zugeordnet
	 * offset speicher die stelle in der regex
	 */
	chunkRoutes(chunk: Route[], method: HttpMethod)
	{
		let routeCollector: string[] = [];
		let handleCollector: Map<number, any[]> = new Map();

		let offset: number = 1;

		for(let route of chunk) {
			routeCollector.push(route.path);

			handleCollector.set(offset,[route.routeId,route.vars]);

			offset += route.vars.length;
		}

		let regex = '^(?:' + routeCollector.join('|') + ')$';

		(!this.dynamicRouteList.has(method))
			? this.dynamicRouteList.set(method,[regex])			//create new Array for this method
			: this.dynamicRouteList.get(method).push(regex);	//use the existing Array

		(!this.handlerList.has(method))
			? this.handlerList.set(method,[handleCollector])
			: this.handlerList.get(method).push(handleCollector);
	}
}

export default GroupPosBased;