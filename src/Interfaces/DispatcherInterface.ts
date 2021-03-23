/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import {HttpMethod} from "../router";

interface DispatcherInterface
{
	/**
	 * versuche die gegebene Route mit static und danach mit dynamic abzugleichen
	 *
	 * @param {HttpMethod | string} method
	 * @param {string} path
	 * @returns {[number , {}] | [number]}
	 */
	dispatch(method: HttpMethod | string, path:string): [number,number,{}] | [number];
}

export default DispatcherInterface;