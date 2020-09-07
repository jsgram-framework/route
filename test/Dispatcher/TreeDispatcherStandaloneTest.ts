import {testDispatcher} from "../DispatcherClass";
import {routeTest} from "../RouteClass";
import {RouterOptions} from "../../src/router";
import {createNewDispatcher, createNewRouteCollector, createRouteMap} from "../helper";
import {assert} from "chai";

const options:RouterOptions = {
	generator:"../src/Generator/Tree/TreeGeneratorStandalone",
	dispatcher:"../src/Dispatcher/Tree/TreeDispatcherStandalone"
};


describe("TreeDispatcherStandalone",() => {
	//TODO dummy tests entfernen wenn standalone regex verarbeiten kann

	it('should test 404', function () {
		const r = createNewRouteCollector(options);

		r.get("/bla","");

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("GET","/test1/21");

		assert.equal(status,404);
	});

	it('should test 404 with head', function () {
		const r = createNewRouteCollector(options);

		r.get("/bla","");

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("HEAD","/test1/21");

		assert.equal(status,404);
	});

	it('should find GET with head', function () {
		const r = createNewRouteCollector(options);

		r.get("/bla","");

		const d = createNewDispatcher(r,options);

		let [status] = d.dispatch("HEAD","/bla");

		assert.equal(status,200);
	});

	//testDispatcher(options);
});


describe("TreeDispatcherStandaloneRouteTest",() => {
	routeTest(options);
});