# SRC_DIR := .
# SOURCES := $(wildcard $(SRC_DIR)/*.ts)

# .PHONY: js
# js: $(SOURCES)
# 	npx tsc $^


# just using a bare "npx tsc" to compile typescirpt files now.
# the tsconfig.json deals with recursively finding all the typescript files.
.PHONY: js
js:
	npx tsc

.PHONY: run
run:
	/Applications/Firefox.app/Contents/MacOS/firefox file:///Users/mike/proj/html_tree/test.html


.PHONY: build_and_run
build_and_run: js run

# build everything than can be built. At the moment that's just typescript stuff.
.PHONY: all
all: js


# for now, just manually list all the directories to delete js files in
.PHONY: clean
clean:
	rm -f *.js
