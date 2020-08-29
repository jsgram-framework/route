import RouteCollector from "../../src/Collector/RouteCollector";
import Route from "../../src/Route";

export class DummyCollector extends RouteCollector
{
	public getAllRoutes(): Map<number,Route>
	{
		return this.routes;
	}
}