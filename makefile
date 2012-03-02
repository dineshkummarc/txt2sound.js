SOURCE := src/*.js

IN := src/core.js src/textvoice.js src/transformer.js src/module.js
OUT := lib/txt2sound.js
OUT_MIN := lib/txt2sound.min.js
RELEASE := txt2sound.js.tar.gz

COMPILER := cat
MINIFIER := uglifyjs

all: minify release

release: $(RELEASE)
minify: $(OUT_MIN)
main: $(OUT)

$(OUT): $(IN)
	mkdir lib/ -p
	$(COMPILER) $^ > $@

$(RELEASE): $(OUT_MIN)
	rm -rf $@
	cd lib && tar pczf $@ *.js

%.min.js: %.js
	$(MINIFIER) $^ > $@

clean:
	rm lib/ -rf

