/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Route from "../../Route";
import {HttpMethod} from "../../router";
import RegexBasedGenerator from "./RegexBasedGenerator";

/**
 * Based on:
 * @link http://nikic.github.io/2014/02/18/Fast-request-routing-using-regular-expressions.html
 * @link https://github.com/nikic/FastRoute
 */
class GroupPosBased extends RegexBasedGenerator
{
	/**
	 * @inheritDoc
	 */
	protected getChunkSize(): number
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
	protected chunkRoutes(chunk: Route[], method: HttpMethod)
	{
		const routeCollector: string[] = [];
		const handleCollector: Map<number, any[]> = new Map();

		let offset = 1;

		for (let i = 0; i < chunk.length; i++) {
			const route = chunk[i];

			routeCollector.push(route.path);

			handleCollector.set(offset, [route.routeId, route.vars]);

			offset += route.vars.length;
		}

		const regex = "^(?:" + routeCollector.join("|") + ")$";

		if (!this.dynamicRouteList.has(method)) {
			this.dynamicRouteList.set(method, [regex]);
		} else {
			this.dynamicRouteList.get(method).push(regex);
		}

		if (!this.handlerList.has(method)) {
			this.handlerList.set(method, [handleCollector]);
		} else {
			this.handlerList.get(method).push(handleCollector);
		}
	}
}

export default GroupPosBased;