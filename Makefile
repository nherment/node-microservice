
static-analysis:
	node_modules/.bin/plato -r -d docs/static-analysis Microservice.js test

test:
	node_modules/.bin/mocha test --reporter spec

.PHONY: test static-analysis