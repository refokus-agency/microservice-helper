NODE_MODULES_BINARIES = ./node_modules/.bin
BUILD_DIR = ./build
DEV_DIR = ./src

BABEL = $(NODE_MODULES_BINARIES)/babel
MOCHA = $(NODE_MODULES_BINARIES)/mocha

DEBUG = maxxis
MAINJS_SERVER_FILE = index.js

all:
	make clean build

build:
	mkdir -p $(BUILD_DIR)
	$(BABEL) ./lib/ -s -D -d $(BUILD_DIR)/lib

clean:
	rm -rf $(BUILD_DIR)

test:
	$(MOCHA) --compilers js:babel-core/register ./tests/*.spec.js

test-find:
	$(MOCHA) --compilers js:babel-core/register ./tests/find.spec.js

test-update:
	$(MOCHA) --compilers js:babel-core/register ./tests/update.spec.js

.PHONY: build clean test test-find test-update
