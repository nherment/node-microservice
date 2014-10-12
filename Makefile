
static-analysis:
	node_modules/.bin/plato -r -d docs/static-analysis Microservice.js test

test:
	node_modules/.bin/mocha test --no-colors --reporter spec

.PHONY: test static-analysis
