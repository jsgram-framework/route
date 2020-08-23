/**
 * @package fast-route
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

interface DispatcherInterface
{
	/**
	 * versuche die gegebene Route mit static und danach mit dynamic abzugleichen
	 *
	 * @param {string} method
	 * @param {string} path
	 * @returns {[number , Map<string, {any}>] | [number]}
	 */
	dispatch(method: string, path:string): [number,number,Map<string,any>] | [number];
}

export default DispatcherInterface;