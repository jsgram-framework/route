/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import GeneratorInterface from "../../Interfaces/GeneratorInterface";
import Route from "../../Route";
import {HttpMethod} from "../../router";
import Node from "./Node";

class TreeGeneratorStandalone implements GeneratorInterface
{
	private dynamicRoutes: Map<HttpMethod, Route[]> = new Map();

	private trees: Map<HttpMethod, Node> = new Map();

	public generate(): Map<HttpMethod, Node>
	{
		this.dynamicRoutes.forEach((routes, method) => {
			if (!this.trees.has(method)) {
				this.trees.set(method, new Node());
			}

			for (let i = 0; i < routes.length; i++) {
				this.trees.get(method).add(routes[i], true);
			}
		});

		return this.trees;
	}

	public mapRoute(route: Route): void
	{
		for (let i = 0; i < route.methods.length; i++) {
			const method = route.methods[i];

			if (!this.dynamicRoutes.has(method)) {
				this.dynamicRoutes.set(method, [route]);
			} else {
				this.dynamicRoutes.get(method).push(route);
			}
		}
	}

}

export default TreeGeneratorStandalone;