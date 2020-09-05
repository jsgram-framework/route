import Generator from "../Generator";
import {HttpMethod} from "../../router";
import Route from "../../Route";

abstract class RegexBasedGenerator extends Generator
{
	/**
	 * Die regex aller Dynamic Routes
	 * geordnet nach ihrer method
	 *
	 * Wie das Array angeordnet ist bestimmt der jeweilige Generator
	 *
	 * @type {Map}
	 */
	protected dynamicRouteList: Map<HttpMethod, any[]> = new Map();

	/**
	 * Alle Handler (Route Id) der Dynamic Routes
	 * geordnet nach ihrer Method
	 *
	 * Wie das Array angeordnet ist bestimmt der jeweilige Generator
	 *
	 * @type {Map}
	 */
	protected handlerList: Map<HttpMethod, any[]> = new Map();

	/**
	 * Gebe an wie viele Items in einen Chunk dürfen
	 * chuck size
	 *
	 * @returns {number}
	 */
	protected abstract getChunkSize(): number;

	/**
	 * Erstelle die Chunks und sortiere die chunks in die jeweilige Method ein
	 *
	 * Unterteile zudem in regex und Handler
	 *
	 * @param {Route[]} chunk
	 * @param {HttpMethod} method
	 */
	protected abstract chunkRoutes(chunk: Route[],method: HttpMethod);

	/**
	 * @inheritDoc
	 */
	protected generateDynamic(): Map<string, Map<HttpMethod, any[]>>
	{
		//iteriere über jede method
		for(let [method,routes] of Array.from(this.dynamicRoutes.entries())) {
			let chunkSize = RegexBasedGenerator.generateChunkSize(routes.length,this.getChunkSize());

			//array chunk
			for (let i = 0, j = routes.length; i < j; i += chunkSize) {
				this.chunkRoutes(routes.slice(i,i+chunkSize),method);
			}
		}

		return new Map([
			["regex",this.dynamicRouteList],
			["dynamichandler",this.handlerList]
		])
	}

	protected static generateChunkSize(count:number, chunkSize:number): number
	{
		let approxChunks = Math.max(1,Math.round(count/chunkSize));	//wie viele Chunks lassen sich erstellen (muss min. einen geben)

		return Math.ceil(count/approxChunks);
	}
}

export default RegexBasedGenerator;