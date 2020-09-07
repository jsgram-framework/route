import Node from "../../src/Generator/Tree/Node";
import {assert} from "chai";

describe("NodeTest",() => {
	it('should not use an invalid node type', function () {
		const nodeClass = require("../../src/Generator/Tree/Node");

		assert.throws(() => {
			const parent = new Node('/a');

			//es 5 style because typescript will not allow this
			const child =new nodeClass.default('/a',{},5);

			parent.addChild(child);
		},"");
	});

	it('parametricBrother of Parent Node, with a parametric child', function () {
		const parent = new Node('/a');

		const parametricChild = new Node(':id');

		parent.addChild(parametricChild);

		assert.equal(parent.parametricBrother, null);
	});

	it('parametricBrother of Parent Node, with a parametric child and a static child', function () {
		const parent = new Node('/a');

		const parametricChild = new Node(':id');
		const staticChild = new Node('/b');

		parent.addChild(parametricChild);
		parent.addChild(staticChild);

		assert.equal(parent.parametricBrother, null);
	});
});