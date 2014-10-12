
static-analysis:
	node_modules/.bin/plato -r -d docs/static-analysis Microservice.js test

coverage:
	node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- --reporter spec test/**/*

test: static-analysis coverage

.PHONY: test static-analysis
