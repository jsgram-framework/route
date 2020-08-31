/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Dispatcher from "./Dispatcher";
import {HttpMethod} from "../router";

/**
 * Based on:
 * @link http://nikic.github.io/2014/02/18/Fast-request-routing-using-regular-expressions.html
 * @link https://github.com/nikic/FastRoute
 */
class GroupPosBased extends Dispatcher
{
	/**
	 * @inheritDoc
	 */
	dispatchDynamic(method: HttpMethod, path: string): [number,number,Map<string,any>] | [number]
	{
		let i: number = 0;	//der zu suchende chunk

		for (let regex of this.dynamicRoutesRegex.get(method)) {
			let matches = path.match(regex);

			if(matches) {
				// find first non-empty match
				// i = 0 = full match
				let j = 1;
				for (; matches[j] == undefined; ++j) {}

				//hole route von der method, der i'te chunk, die j'te stelle
				let route = this.dynamicRoutesHandler.get(method)[i].get(j);

				//setze die Vars in eine map mit ihren namen als index
				let vars = new Map();

				route[1].forEach((item) => {
					vars.set(item,matches[j++]);
				});

				return [200,route[0],vars];
			}

			++i;
		}

		return [404];
	}

}

export default GroupPosBased