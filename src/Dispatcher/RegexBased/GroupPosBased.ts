/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import {HttpMethod} from "../../router";
import RegexBasedDispatcher from "./RegexBasedDispatcher";

/**
 * Based on:
 * @link http://nikic.github.io/2014/02/18/Fast-request-routing-using-regular-expressions.html
 * @link https://github.com/nikic/FastRoute
 */
class GroupPosBased extends RegexBasedDispatcher
{
	/**
	 * @inheritDoc
	 */
	dispatchDynamic(method: HttpMethod, path: string): [number,number,{}] | [number]
	{
		if(false === this.dynamicRoutesRegex.has(method)) {
			//es die method nicht bei den dynamic routes
			return [404];
		}

		for (let i = 0; i < this.dynamicRoutesRegex.get(method).length; i++) {
			let regex = this.dynamicRoutesRegex.get(method)[i];

			let matches = path.match(regex);

			if(matches) {
				// find first non-empty match
				// i = 0 = full match
				let j = 1;
				for (; matches[j] == undefined; ++j) {}

				//hole route von der method, der i'te chunk, die j'te stelle
				let route = this.dynamicRoutesHandler.get(method)[i].get(j);

				//setze die Vars in eine map mit ihren namen als index
				let vars = {};

				for (let k = 0; k < route[1].length; k++) {
					let key = route[1][k];
					vars[key] = matches[j++];
				}

				return [200,route[0],vars];
			}
		}

		return [404];
	}

}

export default GroupPosBased