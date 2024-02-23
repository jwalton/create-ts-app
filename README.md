# create-ts-app

[![NPM version](https://badge.fury.io/js/tt.svg)](https://npmjs.org/package/jwalton/create-ts-app)
![Build Status](https://github.com/jwalton/node-ts-template/workflows/GitHub%20CI/badge.svg)

Create a TS app.  Run with:

```sh
npm init @jwalton/ts-app
```

This creates a node.js application or ESM library using Typescript and SWC.

- `type: "module"` for ESM support.
- swc for compiling and running.
- mocha for unit tests, nyc for code coverage.
- husky and lint-staged for linting and prettifying code on commit.
- ts-node for compiling code during unit tests.

Any files that end in `.spec.ts` will be run as unit tests, and will not be included in the built output in `dist`.
