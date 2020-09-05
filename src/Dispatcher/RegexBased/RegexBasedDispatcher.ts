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

abstract class RegexBasedDispatcher extends Dispatcher
{
	protected dynamicRoutesRegex: Map<HttpMethod, any[]>;

	protected dynamicRoutesHandler: Map<HttpMethod, any[]>;

	constructor(routes: [StaticRoutes, Map<string, Map<HttpMethod, any[]>>])
	{
		super(routes[0]);

		let dynamic: Map<string,any> = routes[1];

		this.dynamicRoutesRegex = dynamic.get('regex');
		this.dynamicRoutesHandler = dynamic.get('dynamichandler');
	}

}

export default RegexBasedDispatcher;