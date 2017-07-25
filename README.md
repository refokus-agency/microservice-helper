# microservice-helper
[![Build Status](https://travis-ci.org/bons/microservice-helper.svg?branch=master)](https://travis-ci.org/bons/microservice-helper)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NSP Status](https://nodesecurity.io/orgs/bons/projects/20009dce-13aa-4e49-820d-310f8b3ae7d3/badge)](https://nodesecurity.io/orgs/bons/projects/20009dce-13aa-4e49-820d-310f8b3ae7d3)

## Description
Common functions for all grm-like microservices

### Tech Stack and keywords

 - [NodeJS](https://nodejs.org/en/)
 - [MongoDB](https://www.mongodb.com/)
 - [Joi](https://github.com/hapijs/joi)
 - [Makefiles](https://www.gnu.org/software/make/manual/make.html)
 - [debug](https://www.npmjs.com/package/debug)

## Requeriments
 - nodejs
 - build-essentials
 - yarn (optional)
 - Seneca js
    - seneca 3.4.1
    - seneca-mesh 0.9.0
    - seneca-mongo-store 1.1.0
    - seneca-transport 2.1.1
    - seneac-entity 1.3.0

## Dependencies
```bash
$ npm install
```

## Prerelease

The library has to be compiled first and pushed in order to be 'npm-installed' from other project.

Every time that a new version needs to be released you must execute the `prerelease` script in one of
the next ways.
It will take the actual version of `package.json` and update it correctly (ie: if the release is
a breaking change it will convert the first number and zero the others)

### Breaking changes
```bash
$ npm run prerelease-br
```

### Feature changes
```bash
$ npm run prerelease-fe
```

### Fix changes
```bash
$ npm run prerelease-fx
```

## Testing

```bash
$ npm test
```
## Documentation

Generate and actualize documentation with:
```bash
npm run generate-docs
```
