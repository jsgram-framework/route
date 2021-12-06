# CHANGELOG

# 1.3.1
# 1.3.0
- since 2021/12/06
- use other route option to create generator, collector and dispatcher
- these are breaking changes!

# 1.2.4
- since 2021/03/28
- router singleton will not save the objects when NODE_ENV = test
  - useful when a fresh state is needed after each test
- changed exports in router.ts: export now all interfaces and RouteCollector, Route Classes

# 1.2.3
- since 2021/03/28
- routes got a new function: build()
- this function will prepare the route for execution
- this function will be called before the server is ready for connections in the RouteCollector
- middleware array in routes are now protected

# 1.2.1
- since 2021/03/23
- export all classes in router.ts

# 1.2.0
- since 2021/03/23
- changed all for of to classic for or forEach (for maps)
- added new tsconfig for tests
- changed folder structure in /dist
- change param return for dispatcher it is an object instead of a map now

# 1.1.0
- since 2020/09/08
- **Radix tree Dispatcher** from find-my-way added. All credits to find-my-way (see README.md#Credits)
- split the dynamic and static routes in Generator and Dispatcher into separate classes

# 1.0.1

- since 2020/09/04
- es2018 used for typescript target

# 1.0.0

- since 2020/09/01
- Router init