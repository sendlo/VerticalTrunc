(function (window, $, undefined) {
	"use strict";

    $.verticaltrunc = function vtrunc(options, callback, element) {

    	this.element = $(element);

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.verticaltrunc.defaults = {
    		"resize": true
	};

    $.verticaltrunc.prototype = {

    	id:"vtrunc",
        		
        /*	
			----------------------------
			Private methods
			----------------------------
		*/

		_create: function(options, callback){
			var opts = $.extend(true, {}, $.verticaltrunc.defaults, options);
			this.options = opts;
			this._trunc();
			this._attach();
			return true;
		},
		
		_update: function(options){
			var self = this;
			if(options){
				self.options = $.extend(true, {}, $.verticaltrunc.defaults, options);				
			}
			self.inner.text(self.text);
			this._trunc();
			return true;
		},
		
		_trunc: function() {
			var self = this,
				maxHeight = self.element.height(),
				innerHeight = 0,
				text;
			if(!self.element.data(self.id+"prep")) {
				self._prep();
			}
			text = self.text;
			innerHeight = self.inner.height();
			while((innerHeight > maxHeight) && (text !== "")){
				text = text.substr(0,text.lastIndexOf(" ")) + "...";
				self.inner.text(text);
				innerHeight = self.inner.height();
			}
		},
		
		// prepare the element for truncation
		_prep: function() {
			var self = this,
				title;
			self.element.data(self.id+"prep",true);
			self.text = self.element.text();
			title = self.element.attr("title"); // set the full text as title on the container
			if(!title || title === "") {
				self.element.attr("title", self.text);
			}
			self.element.html("<div>" + self.text + "</div>");
			self.inner = self.element.children();
		},
		
		// attach events - be careful since this will potentially be applied to many elements
		// TODO: Add this as a single event for all instances
		_attach: function() {
			var self = this;
			if(self.options.resize) {
				$(window).resize(function(){self._update();});
			}
		},
		
        /*	
			----------------------------
			Public methods
			----------------------------
		*/

        update: function(options) {
            this._update(options);
        }
    };

	/*	
		----------------------------
		Function
		----------------------------
	*/


    $.fn.verticaltrunc = function vt_init(options, callback) {

    	
        var thisCall = typeof options;

		switch (thisCall) {

            // allow users to call a specific public method 
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                try{
					this.each(function () {
						var instance = $.data(this, 'verticaltrunc');
	
						if (!instance) {
							throw 'Method ' + options + ' cannot be called until VerticalTrunc is setup';
						}
	
						if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
							throw 'No such public method ' + options + ' for VerticalTrunc';
						}
	
						// no errors!
						instance[options].apply(instance, args);
					});
                } catch(err){
                	if(window.console){
                		console.log(err);
                	}
                	return false;
                }

            break;

            // attempt to create
            case 'undefined':
            case 'object':

                this.each(function () {
	                var instance = $.data(this, 'verticaltrunc');
	                if (instance) {
	                    // update options of current instance
	                    instance.update(options);
	                } else {
	                    // initialize new instance
	                    instance = new $.verticaltrunc(options, callback, this);
	                    // don't attach if instantiation failed
	                    if (!instance.failed) {
	                        $.data(this, 'verticaltrunc', instance);
	                    }
	                }
                });

            break;

        }
		
        return this;
    };

})(window, jQuery);