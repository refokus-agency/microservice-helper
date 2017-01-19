NODE_MODULES_BINARIES = ./node_modules/.bin
BUILD_DIR = ./build
DEV_DIR = ./src

BABEL = $(NODE_MODULES_BINARIES)/babel
BABEL_WATCH = $(NODE_MODULES_BINARIES)/babel-watch
MOCHA = $(NODE_MODULES_BINARIES)/mocha
WATCHIFY = $(NODE_MODULES_BINARIES)/watchify
BROWSERIFY = $(NODE_MODULES_BINARIES)/browserify

DEBUG = maxxis
MAINJS_SERVER_FILE = index.js
MAINJS_CLIENT_FILE = client/app/app.js

dev:
	$(BABEL_WATCH) --watch $(DEV_DIR) $(DEV_DIR)/server/$(MAINJS_SERVER_FILE)

production:
	make clean build run

build:
	mkdir -p $(BUILD_DIR) && mkdir -p $(BUILD_DIR)/static
	$(BABEL) ./src/server -s -D -d $(BUILD_DIR)/

run:
	NODE_ENV=production forever start --uid maxxis $(BUILD_DIR)/$(MAINJS_SERVER_FILE)

stop:
	forever stop maxxis

clean:
	rm -rf $(BUILD_DIR)

test:
	$(MOCHA) --compilers js:babel-core/register ./tests/*.spec.js

test-find:
	$(MOCHA) --compilers js:babel-core/register ./tests/find.spec.js

test-update:
	$(MOCHA) --compilers js:babel-core/register ./tests/update.spec.js

.PHONY: dev production run build clean test stop
