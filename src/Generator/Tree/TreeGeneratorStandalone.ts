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

	public mapRoute(route: Route): void
	{
		//TODO Regex checken

		for(let method of route.methods) {
			if(!this.dynamicRoutes.has(method)) {
				this.dynamicRoutes.set(method,[route]);
			} else {
				this.dynamicRoutes.get(method).push(route);
			}
		}
	}

}

export default TreeGeneratorStandalone;