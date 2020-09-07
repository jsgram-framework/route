/**
 * @package gram-route
 *
 * @link https://gitlab.com/grammm/jsgram/route
 * @licence https://gitlab.com/grammm/jsgram/route/-/blob/master/LICENSE
 *
 * @author Jörn Heinemann <joernheinemann@gxm.de>
 */

import Generator from "../Generator";
import Route from "../../Route";
import {Token} from "path-to-regexp";
import {HttpMethod} from "../../router";
import Node from "./Node";

class TreeGenerator extends Generator
{
	private trees: Map<HttpMethod, Node> = new Map();

	protected generateDynamic(): Map<HttpMethod, Node>
	{
		for(let [method,routes] of Array.from(this.dynamicRoutes.entries())) {
			if(!this.trees.has(method)) {
				this.trees.set(method,new Node());
			}

			for (let route of routes) {
				this.trees.get(method).add(route);
			}
		}

		return this.trees;
	}

	protected prepareDynamicRoute(route: Route, regexp: Token[])
	{
		let path: string = "";
		let params: Map<string|number,RegExp> = new Map();

		for (let datum of regexp) {
			if(typeof datum === 'string') {
				//static teil der route
				path += datum;

				continue;
			}

			if(datum !== null && typeof datum === 'object') {
				//parameter teil
				path += datum.prefix + ":" + datum.name;

				if(datum.pattern !== '[^\\/#\\?]+?') {
					//nur regex pattern speichern, wenn es vom standard abweicht
					params.set(datum.name,new RegExp(datum.pattern));
				}
			}
		}

		route.path = path;
		route.regexParts = params;
	}
}

export default TreeGenerator;