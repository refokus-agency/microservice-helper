# microservice-helper

## Description
Common functions for all grm-like microservices

### Tech Stack and keywords

 - Node.JS
 - Mongo
 - Joi
 - Makefiles

## Requeriments
 - nodejs
 - build-essentials
 - yarn (optional)

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
``
