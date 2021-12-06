import {assert} from "chai";
import {createNewRouteCollector} from "./helper";
import {RouterOptions} from "../src/router";

const options:RouterOptions = {
	generator: "../src/Generator/RegexBased/GroupPosBased",
	dispatcher: "../src/Dispatcher/RegexBased/GroupPosBased"
};

describe("Route Collector", () => {
	it("should create a route with method get", () => {
		const r = createNewRouteCollector(options);

		r.get("/test", () => {
			return "test";
		});

		const route = r.getRoute(0);

		const handleReturn = route.handler();

		assert.equal(route.path, "/test");
		assert.equal(handleReturn, "test");
		assert.equal(route.methods[0], "GET");
	});

	it("should create route and groups", function() {
		const r = createNewRouteCollector(options);

		r.group("/testGroup", () => {
			r.get("/test", () => {
				return "test";
			});

			r.group("/nested", () => {
				r.get("/test", () => {
					return "test nested";
				});
			});
		});

		const route = r.getRoute(0);
		const nestedRoute = r.getRoute(1);

		const handleReturn1 = route.handler();
		const handleReturn2 = nestedRoute.handler();

		assert.equal(handleReturn1, "test");
		assert.equal(handleReturn2, "test nested");

		assert.equal(route.path, "/testGroup/test");
		assert.equal(nestedRoute.path, "/testGroup/nested/test");
	});

	it("should create post route", function() {
		const r = createNewRouteCollector(options);

		const route = r.post("/test", () => {

		});

		assert.equal(route.methods[0], "POST");
	});

	it("should create put route", function() {
		const r = createNewRouteCollector(options);

		const route = r.put("/test", () => {

		});

		assert.equal(route.methods[0], "PUT");
	});

	it("should create delete route", function() {
		const r = createNewRouteCollector(options);

		const route = r.delete("/test", () => {

		});

		assert.equal(route.methods[0], "DELETE");
	});

	it("should create head route", function() {
		const r = createNewRouteCollector(options);

		const route = r.head("/test", () => {

		});

		assert.equal(route.methods[0], "HEAD");
	});

	it("should create patch route", function() {
		const r = createNewRouteCollector(options);

		const route = r.patch("/test", () => {

		});

		assert.equal(route.methods[0], "PATCH");
	});

	it("should create options route", function() {
		const r = createNewRouteCollector(options);

		const route = r.options("/test", () => {

		});

		assert.equal(route.methods[0], "OPTIONS");
	});

	it("should create any route", function() {
		const r = createNewRouteCollector(options);

		const route = r.any("/test", () => {

		});

		assert.equal(route.methods[0], "GET");
		assert.equal(route.methods[1], "POST");
		assert.equal(route.methods[2], "PUT");
		assert.equal(route.methods[3], "DELETE");
		assert.equal(route.methods[4], "OPTIONS");
		assert.equal(route.methods[5], "PATCH");
		assert.equal(route.methods[6], "HEAD");
	});

	it("should create getpost route", function() {
		const r = createNewRouteCollector(options);

		const route = r.getpost("/test", () => {

		});

		assert.equal(route.methods[0], "GET");
		assert.equal(route.methods[1], "POST");
	});

	it("should create a dynamic route", function() {
		const r = createNewRouteCollector(options);

		r.group("/testDynamic", () => {
			r.get("/dynamic/:id", () => {

			});
		});

		const route = r.getRoute(0);

		assert.equal(route.path, "\\/testDynamic\\/dynamic\\/([^\\/#\\?]+?)");
	});
});