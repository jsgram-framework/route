/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Dispatcher from "../Dispatcher";
import {HttpMethod} from "../../router";
import {StaticRoutes} from "../../Interfaces/GeneratorInterface";
import Node from "../../Generator/Tree/Node";


class TreeDispatcher extends Dispatcher
{
	private trees: Map<HttpMethod, Node>;

	constructor(routes: [StaticRoutes, Map<HttpMethod, Node>])
	{
		super(routes[0]);

		this.trees = routes[1];
	}

	dispatchDynamic(method: HttpMethod, path: string): [number,number,{}] | [number]
	{
		if(!this.trees.has(method)) {
			return [404];
		}

		const node: Node = this.trees.get(method);

		let result = node.find(path);

		if(result === undefined || result === null) {
			return [404];
		}

		return [200,result[0],result[1]];
	}

}

export default TreeDispatcher;