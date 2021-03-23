/**
 * @copyright Copyright (c) 2017-2019 Tomas Della Vedova
 * @link https://github.com/delvedor/find-my-way/blob/master/LICENSE
 */

import Route from "../../Route";
import assert = require("assert");

export type NodeType = 0 | 1 | 2 | 3;

const STATIC: NodeType = 0;

const PARAM: NodeType = 1;

const CATCH_ALL: NodeType = 2;

const REGEX: NodeType = 3;

type NodeHandle = {
	asset: any;
	paramNames: any[];
};


class Node
{
	public label: string;

	public numberOfChildren: number;

	constructor(
		public prefix: string = "/",
		public children: object = {},
		public type: NodeType = STATIC,
		public handle: NodeHandle = null,
		public regex: RegExp = null,
		public wildcardChild = null,
		public parametricBrother = null
	) {
		this.label = prefix[0];
		this.numberOfChildren = Object.keys(this.children).length;
	}

	public find(path: string): [any, {}]
	{
		let originalPath: string = path;
		let originalPathLength: number = path.length;

		let currentNode: Node = this;
		let wildcardNode: Node = null;
		let pathLenWildcard = 0;
		let pindex: number = 0;
		const params: any[] = [];
		let i: number;
		let idxInOriginalPath: number = 0;

		while (true) {
			let pathLen: number = path.length;
			let prefix = currentNode.prefix;
			let prefixLen = prefix.length;
			let len = 0;
			let previousPath = path;

			if (pathLen === 0 || path === prefix) {
				// found the route
				let handle = currentNode.handle.asset;

				if (handle !== null && handle !== undefined) {
					const returnParams = {};

					if(currentNode.handle.paramNames.length > 0) {
						for (let j = 0; j < currentNode.handle.paramNames.length; j++) {
							let key = currentNode.handle.paramNames[j];
							returnParams[key] = params[j];
						}
					}

					return [
						handle,
						returnParams
					];
				}
			}

			// search for the longest common prefix
			i = pathLen < prefixLen ? pathLen : prefixLen;
			while (len < i && path.charCodeAt(len) === prefix.charCodeAt(len)) len++;

			if (len === prefixLen) {
				path = path.slice(len);
				pathLen = path.length;
				idxInOriginalPath += len;
			}

			let node: Node = currentNode.findChild(path);

			if (node === null) {
				node = currentNode.parametricBrother;

				if (node === null) {
					return this.getWildcardNode(wildcardNode,originalPath,pathLenWildcard);
				}

				let goBack: string = previousPath.charCodeAt(0) === 47 ? previousPath : '/' + previousPath;

				if (originalPath.indexOf(goBack) === -1) {
					// we need to know the outstanding path so far from the originalPath since the last encountered "/" and assign it to previousPath.
					// e.g originalPath: /aa/bbb/cc, path: bb/cc
					// outstanding path: /bbb/cc

					let pathDiff: string = originalPath.slice(0, originalPathLength - pathLen);

					previousPath = pathDiff.slice(pathDiff.lastIndexOf('/') + 1, pathDiff.length) + path;
				}

				idxInOriginalPath = idxInOriginalPath - (previousPath.length - path.length);

				path = previousPath;
				pathLen = previousPath.length;
				len = prefixLen;
			}

			let type = node.type;

			if (type === STATIC) {
				// static route

				if(currentNode.wildcardChild !== null && currentNode.wildcardChild.handle !== null) {
					// if exist, save the wildcard child
					wildcardNode = currentNode.wildcardChild;
					pathLenWildcard = pathLen;
				}

				currentNode = node;
				continue;
			}

			/* istanbul ignore if */
			if (len !== prefixLen) {
				return this.getWildcardNode(wildcardNode,originalPath,pathLenWildcard);
			}

			if(currentNode.wildcardChild !== null && currentNode.wildcardChild.handle !== null) {
				// if exist, save the wildcard child
				wildcardNode = currentNode.wildcardChild;
				pathLenWildcard = pathLen;
			}

			if(type === PARAM) {
				// parametric route
				currentNode = node;
				i = path.indexOf('/');

				if (i === -1) {
					i = pathLen;
				}

				params[pindex++] = originalPath.slice(idxInOriginalPath, idxInOriginalPath + i);
				path = path.slice(i);
				idxInOriginalPath += i;
				continue;
			}

			if(type === CATCH_ALL) {
				// wildcard route
				params[pindex] = originalPath.slice(idxInOriginalPath);

				currentNode = node;
				path = '';
				continue;
			}

			if(type === REGEX) {
				// parametric(regex) route
				currentNode = node;
				i = path.indexOf('/');

				if (i === -1) i = pathLen;

				let check = originalPath.slice(idxInOriginalPath, idxInOriginalPath + i);

				if(node.regex) {
					if(!node.regex.test(check)) return null;
				}

				params[pindex++] = check;
				path = path.slice(i);
				idxInOriginalPath += i;
				continue;
			}

			/* istanbul ignore next */
			wildcardNode = null;
		}
	}

	public add(route: Route, standAlone: boolean = false): void
	{
		let path = route.path;
		let handle = route.routeId;
		let routeRegex = route.regexParts;
		const params = [];
		let j = 0;

		for (let i = 0, len = path.length; i < len; ++i) {
			// search for parametric or wildcard routes
			// parametric route
			if(path.charCodeAt(i) === 58) {
				let type = PARAM;
				j = i + 1;
				let staticPart = path.slice(0, i);

				this.insert(staticPart,STATIC);

				let isRegex = false;
				while (i < len && path.charCodeAt(i) !== 47) {
					isRegex = isRegex || path[i] === '(';
					if(isRegex) {
						i = this.getClosingParenthensePosition(path,i) + 1;
						break;
					} else if(path.charCodeAt(i) !== 45) {
						++i;
					} else {
						/* istanbul ignore next */
						break;
					}
				}

				//save the params
				let parameter = path.slice(j, i);

				let regex: RegExp = null;

				if(standAlone) {
					if(isRegex && (i === len || path.charCodeAt(i) === 47)) {
						type = REGEX;
					}

					let regexParam = isRegex ? parameter.slice(parameter.indexOf('('), i) : null;

					if(isRegex) {
						regex = new RegExp(regexParam);
					}

					params.push(parameter.slice(0, isRegex ? parameter.indexOf('(') : i));
				} else {
					//check if the regex pattern is different from the standard one
					//only if the route was parsed before
					regex = routeRegex.get(parameter);

					if(regex !== undefined && regex !== null) {
						//if so then check regex as well
						type = REGEX;
					}

					params.push(parameter.slice(0, i));
				}

				path = path.slice(0, j) + path.slice(i);
				i = j;
				len = path.length;

				// if the path is ended
				if (i === len) {
					let completedPath = path.slice(0, i);

					return this.insert(completedPath,type,params,handle,regex);
				}

				staticPart = path.slice(0, i);

				this.insert(staticPart,type,params,null);

				--i;
			} else if(path.charCodeAt(i) === 42) {
				//Wildcard route
				this.insert(path.slice(0, i),STATIC);

				// add the wildcard parameter
				params.push('*');

				return this.insert(path.slice(0, len),CATCH_ALL,params,handle)
			}
		}

		//static route
		this.insert(path,STATIC,params,handle);
	}

	protected insert(path: string, type: NodeType, params = null, handle: any = null, regex: RegExp = null): void
	{
		const route = path;

		let currentNode: Node = this;
		let prefix: string;
		let pathLen: number;
		let prefixLen: number;
		let len: number;
		let max: number;
		let node: Node = null;

		while (true) {
			prefix = currentNode.prefix;
			prefixLen = prefix.length;
			pathLen = path.length;
			len = 0;

			// search for the longest common prefix
			max = pathLen < prefixLen ? pathLen : prefixLen;
			while (len < max && path[len] === prefix[len]) len++;

			// the longest common prefix is smaller than the current prefix
			// let's split the node and add a new child
			if (len < prefixLen) {
				node = new Node(
					prefix.slice(len),
					currentNode.children,
					currentNode.type,
					currentNode.handle,
					currentNode.regex
				);

				if (currentNode.wildcardChild !== null) {
					node.wildcardChild = currentNode.wildcardChild
				}

				// reset the parent
				currentNode
					.reset(prefix.slice(0, len))
					.addChild(node);

				// if the longest common prefix has the same length of the current path
				// the handler should be added to the current node, to a child otherwise
				if (len === pathLen) {
					assert(currentNode.handle === null, `handle already declared for route '${route}'`);
					currentNode.createHandle(handle,params);

					currentNode.type = type;
				} else {
					let nodeHandle = {
						asset: handle,
						paramNames: params
					};

					node = new Node(
						path.slice(len),
						{},
						type,
						nodeHandle,
						regex
					);

					currentNode.addChild(node);
				}
			} else if(len < pathLen) {
				// the longest common prefix is smaller than the path length,
				// but is higher than the prefix

				// remove the prefix
				path = path.slice(len);
				// check if there is a child with the label extracted from the new path
				node = currentNode.findByLabel(path);

				// there is a child within the given label, we must go deepen in the tree
				if (node) {
					currentNode = node;
					continue;
				}

				let nodeHandle = {
					asset: handle,
					paramNames: params
				};

				node = new Node(path, {},type, nodeHandle, regex);

				currentNode.addChild(node);
			} else if(handle !== null) {
				// the node already exist
				assert(currentNode.handle === null, `handle already declared for route '${route}'`);
				currentNode.createHandle(handle,params);
			}

			return;
		}
	}

	protected reset(prefix: string): Node
	{
		this.prefix = prefix;
		this.children = {};
		this.type = STATIC;
		this.handle = null;
		this.numberOfChildren = 0;
		this.regex = null;
		this.wildcardChild = null;

		return this;
	}

	public addChild(n: Node): Node
	{
		let label: string = '';

		switch (n.type) {
			case STATIC:
				label = n.label;
				break;
			case PARAM:
			case REGEX:
				label = ':';
				break;
			case CATCH_ALL:
				label = "*";
				this.wildcardChild = n;
				break;
			default:
				throw new Error(`Unknown node type: ${n.type}`)
		}

		assert(
			this.children[label] === undefined,
			`There is already a child with label '${label}'`
		);

		this.children[label] = n;
		this.numberOfChildren = Object.keys(this.children).length;

		const labels = Object.keys(this.children);
		let parametricBrother = this.parametricBrother;

		for (let i = 0; i < labels.length; ++i) {
			const child = this.children[labels[i]];

			if (child.label === ':') {
				parametricBrother = child;
				break;
			}
		}

		const iterate = (n: Node) => {
			/* istanbul ignore if */
			if (!n) return;

			if (n.type !== STATIC) {
				return;
			}

			if (n !== this) {
				n.parametricBrother = parametricBrother || n.parametricBrother
			}

			const labels = Object.keys(n.children);
			for (var i = 0; i < labels.length; i++) {
				iterate(n.children[labels[i]]);
			}
		};

		iterate(this);

		return this;
	}

	protected findByLabel(path: string): Node
	{
		return this.children[path[0]];
	}

	protected findChild(path: string): Node | null
	{
		let child: Node = this.children[path[0]];

		if(child !== undefined && (child.numberOfChildren > 0 || child.handle !== null)) {
			if (path.slice(0, child.prefix.length) === child.prefix) {
				return child;
			}
		}

		child = this.children[':'];

		if(child !== undefined && (child.numberOfChildren > 0 || child.handle !== null)) {
			return child;
		}

		child = this.children['*'];

		if(child !== undefined && (child.numberOfChildren > 0 || child.handle !== null)) {
			return child;
		}

		return null;
	}

	protected getWildcardNode(node: Node, path: string, len: number): [number, {}]
	{
		if (node === null) return null;

		let handle: any = node.handle;

		let param = {
			'*':path.slice(-len)
		}

		if (handle !== null && handle !== undefined) {
			return [
				handle.asset,
				param
			];
		}

		/* istanbul ignore next */
		return null
	}

	/**
	 * `path.indexOf()` will always return the first position of the closing parenthese,
	 * but it's inefficient for grouped or wrong regexp expressions.
	 *
	 * @param {string} path
	 * @param {number} idx
	 */
	protected getClosingParenthensePosition(path: string, idx: number)
	{
		let parentheses = 1;

		while (idx < path.length) {
			++idx;

			if(path[idx] === '\\') {
				// ignore skipped chars
				idx++;
				continue;
			}

			if(path[idx] === ')') {
				--parentheses;
			} else if(path[idx] === '(') {
				++parentheses;
			}

			if (!parentheses) return idx
		}

		throw new TypeError('Invalid regexp expression in "' + path + '"');
	}

	public createHandle(assert: any, params: any[])
	{
		this.handle = {
			asset: assert,
			paramNames: params
		};
	}
}

export default Node;