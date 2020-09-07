/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import DispatcherInterface from "../../Interfaces/DispatcherInterface";
import {HttpMethod} from "../../router";
import Node from "../../Generator/Tree/Node";

class TreeDispatcherStandalone implements DispatcherInterface
{
	constructor(private routes: Map<HttpMethod, Node>) {}

	public dispatch(method: HttpMethod, path: string): [number, number, Map<string, any>] | [number]
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

	public doDispatch(method: HttpMethod, path: string): [number, number, Map<string, any>] | [number]
	{
		if(!this.routes.has(method)) {
			return [404];
		}

		const node: Node = this.routes.get(method);

		let result = node.find(path);

		if(result === undefined || result === null) {
			return [404];
		}

		return [200,result[0],result[1]];
	}

}

export default TreeDispatcherStandalone;