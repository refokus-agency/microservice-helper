NODE_MODULES_BINARIES = ./node_modules/.bin
BUILD_DIR = ./build
DEV_DIR = ./src
DIST_DIR = ./dist
JS_FILES=$(shell find lib -type f -name '*.js' | tail -r)

BABEL = $(NODE_MODULES_BINARIES)/babel
MOCHA = $(NODE_MODULES_BINARIES)/mocha
SEMVER = $(NODE_MODULES_BINARIES)/semver
JSON_TOOL = $(NODE_MODULES_BINARIES)/json
STANDARD = $(NODE_MODULES_BINARIES)/standard
SNAZZY = $(NODE_MODULES_BINARIES)/snazzy
JSDOC2MD = $(NODE_MODULES_BINARIES)/jsdoc2md

MAINJS_SERVER_FILE = index.js

HELPER_VERSION = $(shell cat package.json | $(JSON_TOOL) version)

all:
	make clean build

build:
	mkdir -p $(BUILD_DIR)
	$(BABEL) ./lib/ -s -D -d $(BUILD_DIR)/lib

clean:
	rm -rf $(BUILD_DIR)

prerelease:
ifndef VERSION_TYPE
	$(error VERSION_TYPE is not set)
endif

	rm -rf $(DIST_DIR)
	mkdir -p $(DIST_DIR)
	$(BABEL) ./lib/ -s -D -d $(DIST_DIR)

ifeq ($(VERSION_TYPE), br)
	$(eval NEW_VERSION := $(shell $(SEMVER) --increment major $(HELPER_VERSION)))
endif
ifeq ($(VERSION_TYPE), fe)
	$(eval NEW_VERSION := $(shell $(SEMVER) --increment minor $(HELPER_VERSION)))
endif
ifeq ($(VERSION_TYPE), fx)
	$(eval NEW_VERSION := $(shell $(SEMVER) --increment patch $(HELPER_VERSION)))
endif

	cat package.json | $(JSON_TOOL) -e 'this.version="$(NEW_VERSION)"' > package.json.tmp
	mv package.json.tmp package.json

code-style:
	$(STANDARD) --fix --verbose | $(SNAZZY)

test:
	make code-style && $(MOCHA) --compilers js:babel-core/register ./tests/*.spec.js

test-db:
	make code-style && $(MOCHA) --compilers js:babel-core/register ./tests/db.spec.js

test-microservice:
	make code-style && $(MOCHA) --compilers js:babel-core/register ./tests/microservice.spec.js

test-handler:
	make code-style && $(MOCHA) --compilers js:babel-core/register ./tests/handler.spec.js

generate-docs:
	$(JSDOC2MD) $(JS_FILES) > API.md

.PHONY: build clean prerelease test test-db test-microservice test-handler code-style generate-docs
