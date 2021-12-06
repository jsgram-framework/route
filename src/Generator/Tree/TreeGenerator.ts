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
		this.dynamicRoutes.forEach((routes, method) => {
			if (!this.trees.has(method)) {
				this.trees.set(method, new Node());
			}

			for (let i = 0; i < routes.length; i++) {
				this.trees.get(method).add(routes[i]);
			}
		});

		return this.trees;
	}

	protected prepareDynamicRoute(route: Route, regexp: Token[])
	{
		let path = "";
		const params: Map<string | number, RegExp> = new Map();

		for (let i = 0; i < regexp.length; i++) {
			const datum = regexp[i];

			if (typeof datum === "string") {
				//static teil der route
				path += datum;

				continue;
			}

			if (datum !== null && typeof datum === "object") {
				//parameter teil
				path += datum.prefix + ":" + datum.name;

				if (datum.pattern !== "[^\\/#\\?]+?") {
					//nur regex pattern speichern, wenn es vom standard abweicht
					params.set(datum.name, new RegExp(datum.pattern));
				}
			}
		}

		route.path = path;
		route.regexParts = params;
	}
}

export default TreeGenerator;