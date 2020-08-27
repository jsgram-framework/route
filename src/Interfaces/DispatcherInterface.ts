/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import {httpMethod} from "../router";

interface DispatcherInterface
{
	/**
	 * versuche die gegebene Route mit static und danach mit dynamic abzugleichen
	 *
	 * @param {httpMethod | string} method
	 * @param {string} path
	 * @returns {[number , Map<string, {any}>] | [number]}
	 */
	dispatch(method: httpMethod | string, path:string): [number,number,Map<string,any>] | [number];
}

export default DispatcherInterface;