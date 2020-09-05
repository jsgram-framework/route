import {RouterOptions} from "../src/router";
import RouteCollectorInterface from "../src/Interfaces/RouteCollectorInterface";
import DispatcherInterface from "../src/Interfaces/DispatcherInterface";

export function createNewRouteCollector(options: RouterOptions): RouteCollectorInterface
{
	let routeCollectorPath = "";
	if(!options.collector) {
		routeCollectorPath = "../src/Collector/RouteCollector";
	} else {
		routeCollectorPath = options.collector;
	}

	const generator = require(options.generator);

	const routeCollectorClass = require(routeCollectorPath);

	return new routeCollectorClass.default(new generator.default());
}

export function createNewDispatcher(collector: RouteCollectorInterface, options: RouterOptions): DispatcherInterface
{
	let dispatcherClass = require(options.dispatcher);

	return new dispatcherClass.default(collector.getData());
}

export function createBigMap(r: RouteCollectorInterface)
{
	r.get("/",() => {
		return "index";
	});

	r.group("/test1",() => {
		//dynamic routes test
		r.group("/:id",() => {
			r.get("",() => {
				return "matched GET dynamic";
			});

			r.post("",() => {
				return "matched POST dynamic";
			});

			r.put("",() => {
				return "matched PUT dynamic";
			});

			r.delete("",() => {
				return "matched DELETE dynamic";
			});

			r.options("",() => {
				return "matched OPTIONS dynamic";
			});

			r.patch("",() => {
				return "matched PATCH dynamic";
			});

			r.head("",() => {
				return "matched HEAD dynamic";
			});

			r.any("/any",() => {
				return "matched any dynamic";
			});

			r.get("/routeChunk1/:id",() => {});
			r.get("/routeChunk2/:id",() => {});
			r.get("/routeChunk3/:id",() => {});
			r.get("/routeChunk4/:id",() => {});
			r.get("/routeChunk5/:id",() => {});
			r.get("/routeChunk6/:id",() => {});
			r.get("/routeChunk7/:id",() => {});
			r.get("/routeChunk8/:id",() => {});
			r.get("/routeChunk9/:id",() => {});
			r.get("/routeChunk10/:id",() => {});
			r.get("/routeChunk11/:id",() => {});
			r.get("/routeChunk12/:id",() => {});
		});

		r.group("/static",() => {
			r.get("",() => {
				return "matched GET static";
			});

			r.post("",() => {
				return "matched POST static";
			});

			r.put("",() => {
				return "matched PUT static";
			});

			r.delete("",() => {
				return "matched DELETE static";
			});

			r.options("",() => {
				return "matched OPTIONS static";
			});

			r.patch("",() => {
				return "matched PATCH static";
			});

			r.head("",() => {
				return "matched HEAD static";
			});

			r.any("",() => {
				return "matched any static";
			});
		});

		//nested groups

		r.group("/nestedGroup1",() => {
			r.get("/nestedRoute1",() => {
				return "nestedG1R1";
			});

			r.get("/nestedRoute2/:id",() => {
				return "nestedG1R2";
			});

			r.group("/nestedGroup2",() => {
				r.get("/nestedRoute1",() => {
					return "nestedG2R1";
				});

				r.get("/nestedRoute2/:id",() => {
					return "nestedG2R2";
				});

				r.group("/nestedGroup3",() => {
					r.get("/nestedRoute1",() => {
						return "nestedG3R1";
					});

					r.get("/nestedRoute2/:id",() => {
						return "nestedG3R2";
					});
				});
			});
		});
	});

	r.get("/dynamic/:id2/:id3/:id4",() => {
		return "route with more than one dynamic param";
	});
}

export function createMapWithMiddleware(r: RouteCollectorInterface)
{
	r.get("/routeMw1",() => {

	}).add(() => {
		return "routeMw1";
	});

	r.group("/mwGroup1",() => {
		r.get("/routeMw2",() => {

		}).add(() => {
			return "routeMw2";
		});

		r.group("/mwGroup2",() => {
			r.group("/mwGroup3",() => {
				r.get("/routeMw4",() => {

				}).add(() => {
					return "routeMw4";
				}).add(() => {
					return "routeMw4.1";
				});
			}).add(() => {
				return "mwGroup3";
			}).add(() => {
				return "mwGroup3.1"
			});

			r.get("/routeMw3",() => {

			}).add(() => {
				return "routeMw3";
			});
		}).add(() => {
			return "mwGroup2";
		});
	}).add(() => {
		return "mwGroup1";
	});
}

export function createRouteMap(options: RouterOptions, mapType: number = 1): RouteCollectorInterface
{
	const r = createNewRouteCollector(options);

	switch (mapType) {
		case 1:
			createBigMap(r);
			break;
		case 2:
			createMapWithMiddleware(r);
			break;
		default:
			break;
	}

	return r;
}