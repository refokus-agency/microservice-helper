NODE_MODULES_BINARIES = ./node_modules/.bin
BUILD_DIR = ./build
DEV_DIR = ./src

BABEL = $(NODE_MODULES_BINARIES)/babel
MOCHA = $(NODE_MODULES_BINARIES)/mocha

MAINJS_SERVER_FILE = index.js

all:
	make clean build

build:
	mkdir -p $(BUILD_DIR)
	$(BABEL) ./lib/ -s -D -d $(BUILD_DIR)/lib

clean:
	rm -rf $(BUILD_DIR)


test-db:
	$(MOCHA) --compilers js:babel-core/register ./tests/db.spec.js

.PHONY: build clean test-db
