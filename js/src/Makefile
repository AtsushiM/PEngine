SRC = Util.js Class.js Base.js Observer.js Engine.js Collision.js Entity.js CollisionDetector.js CollisionResolver.js namespace.js
COMBINE = ../PEngine.js
COMPRESS = ../PEngine.min.js

$(COMBINE) : $(SRC)
	cat $^ > $@

	growlnotify -t 'auto-make' -m 'make start.'
	((java -jar /Applications/gcc/compiler.jar --output_wrapper '!function(){%output%}();' --compilation_level=ADVANCED_OPTIMIZATIONS --js $(COMBINE) --js_output_file $(COMPRESS)) && growlnotify -t 'auto-make' -m 'make complete.') || growlnotify -t 'auto-make' -m 'make error.'
#	rm -f $(COMBINE)

.PHONY: clean
clean :
	rm -f $(COMBINE) $(COMPRESS)
