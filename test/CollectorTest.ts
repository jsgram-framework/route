import {assert} from "chai";
import Route from "../src/Route";
import {createNewRouteCollector} from "./helper";


describe('Route Collector',() => {
	it('should create a route with method get', () => {
		const r = createNewRouteCollector();

		const route = r.get("/test",() => {
			return "test";
		});

		const handleReturn = route.handler();

		assert.equal(route.path,"/test");
		assert.equal(handleReturn,'test');
		assert.equal(route.methods[0],'GET')
	});

	it('should create route and groups', function () {
		const r = createNewRouteCollector();

		let route: Route;
		let nestedRoute: Route;

		r.group("/testGroup",() => {
			route = r.get("/test",() => {
				return "test";
			});

			r.group("/nested",() => {
				nestedRoute = r.get("/test",() => {
					return "test nested";
				});
			});
		});

		const handleReturn1 = route.handler();
		const handleReturn2 = nestedRoute.handler();

		assert.equal(handleReturn1,'test');
		assert.equal(handleReturn2,'test nested');

		assert.equal(route.path,'/testGroup/test');
		assert.equal(nestedRoute.path,'/testGroup/nested/test');
	});

	it('should create post route', function () {
		const r = createNewRouteCollector();

		const route = r.post("/test",() => {

		});

		assert.equal(route.methods[0],'POST');
	});

	it('should create put route', function () {
		const r = createNewRouteCollector();

		const route = r.put("/test",() => {

		});

		assert.equal(route.methods[0],'PUT');
	});

	it('should create delete route', function () {
		const r = createNewRouteCollector();

		const route = r.delete("/test",() => {

		});

		assert.equal(route.methods[0],'DELETE');
	});

	it('should create head route', function () {
		const r = createNewRouteCollector();

		const route = r.head("/test",() => {

		});

		assert.equal(route.methods[0],'HEAD');
	});

	it('should create patch route', function () {
		const r = createNewRouteCollector();

		const route = r.patch("/test",() => {

		});

		assert.equal(route.methods[0],'PATCH');
	});

	it('should create options route', function () {
		const r = createNewRouteCollector();

		const route = r.options("/test",() => {

		});

		assert.equal(route.methods[0],'OPTIONS');
	});

	it('should create any route', function () {
		const r = createNewRouteCollector();

		const route = r.any("/test",() => {

		});

		assert.equal(route.methods[0],"GET");
		assert.equal(route.methods[1],"POST");
		assert.equal(route.methods[2],"PUT");
		assert.equal(route.methods[3],"DELETE");
		assert.equal(route.methods[4],"OPTIONS");
		assert.equal(route.methods[5],"PATCH");
		assert.equal(route.methods[6],"HEAD");
	});

	it('should create getpost route', function () {
		const r = createNewRouteCollector();

		const route = r.getpost("/test",() => {

		});

		assert.equal(route.methods[0],"GET");
		assert.equal(route.methods[1],"POST");
	});
});