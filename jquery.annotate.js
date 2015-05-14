/*!
 * jQuery Annotation Plugin
 * http://www.zurb.com/playground/javascript-annotation-plugin
 *
 * Copyright 2010, ZURB
 * Released under the MIT License
 */
(function($){
	
	$.lefunc = function(){
		alert("lefunc");
	}
	$.fn.annotatableImage = function(annotationCallback, options) {
		var defaults = {
	    xPosition: 'middle',
	    yPosition: 'middle'
	  };
		var options = $.extend(defaults, options);
	
		annotations = [];
		var image = $('img', this)[0];
		var date = new Date();
		var startTime = date.getTime();
	
		this.click(function(event){
			if (event.target == image) {
				// event.preventDefault();
			
				console.log("width: ", options.width, "height: ", options.height)
				var element = annotationCallback(options.width, options.height);
				annotations.push(element);
				$(this).append(element);
			
				element.positionAtEvent(event, options.xPosition, options.yPosition);
			
				var date = new Date();
				element.data('responseTime', date.getTime() - startTime);
			} else{
				console.log("failed to display annotation");
			}
		});
	};

	$.fn.addAnnotations = function(annotationCallback, annotations, options) {
		var container = this;
		var containerHeight = $(container).height();
		var defaults = {
	    xPosition: 'middle',
	    yPosition: 'middle',
			height: containerHeight
	  };
		var options = $.extend(defaults, options);
	
		$.each(annotations, function() {
			var element = annotationCallback(this);
			element.css({position: 'absolute'});
		
			$(container).append(element);
		
			var left = (this.x * $(container).width()) - ($(element).xOffset(options.xPosition));
			var top = (this.y * options.height) - ($(element).yOffset(options.yPosition));
			if (this.width && this.height) {
				var width = (this.width * $(container).width());
				var height = (this.height * $(container).height());
				element.css({width: width + 'px', height: height + 'px'});
			}
		
			element.css({ left: left + 'px', top: top + 'px'});
			if (top > containerHeight) {
				element.hide();
			}
		});
	};

  // determines actual location of annotations
	$.fn.positionAtEvent = function(event, xPosition, yPosition) {
		var container = $(this).parent('div');
		$(this).css('position', 'absolute');
		$(this).css('left', event.pageX - container.offset().left - ($(this).xOffset(xPosition)) + 'px');
		$(this).css('top', event.pageY - container.offset().top - ($(this).yOffset(yPosition)) + 'px');
	};

	$.fn.seralizeAnnotations = function(xPosition, yPosition) {
		var annotations = [];
		this.each(function(){
			annotations.push({x: $(this).relativeX(xPosition), y: $(this).relativeY(yPosition), response_time: $(this).data('responseTime')});
		});
		return annotations;
	};

	$.fn.relativeX = function(xPosition) {
		var left = $(this).coordinates().x + ($(this).xOffset(xPosition));
		var width = $(this).parent().width();
		// console.log("left: ", left, "width: ", width);
		return left / width;
	}

	$.fn.relativeY = function(yPosition) {
		var top = $(this).coordinates().y + ($(this).yOffset(yPosition));
		var height = $(this).parent().height();
		// console.log("top: ", top, "height: ", height);
		return top / height;
	}

	$.fn.dragRelativeX = function(x) {
		var left = x;
		var width = $(this).parent().width();
		// console.log("dragRelativeX: ", "left: ", left, "width: ", width);
		// console.log("dragRelativeX: ", left / width);
		return left / width;
	}

	$.fn.dragRelativeY = function(y) {
		var top = y;
		var height = $(this).parent().height();
		// console.log("dragRelativeY: ", "top: ", top, "height: ", height);
		// console.log("dragRelativeY: ", top / height);
		return top / height;
	}

	$.fn.relativeWidth = function() {
		return $(this).width() / $(this).parent().width();
	}

	$.fn.relativeHeight = function() {
		return $(this).height() / $(this).parent().height();
	}

	$.fn.xOffset = function(xPosition) {
		switch (xPosition) {
			case 'left': return 0; break;
			case 'right': return $(this).width(); break;
			default: return $(this).width() / 2; // middle
		}
	};

	$.fn.yOffset = function(yPosition) {
		switch (yPosition) {
			case 'top': return 0; break;
			case 'bottom': return $(this).height(); break;
			default: return $(this).height() / 2; // middle
		}
	};
	
	$.fn.coordinates = function() {
		return {x: parseInt($(this).css('left').replace('px', '')), y: parseInt($(this).css('top').replace('px', ''))};
	};
	
})(jQuery);