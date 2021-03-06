
/*
	GP bounce js
	@author Daniel Chadwick
	@copyright Giant Peach Design 2011
	@version 1.0
*/

(function($){
 
    //Attach this new method to jQuery
    $.fn.extend({
         
        //This is where you write your plugin's name
        bounce: function(options) {
 
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
				autoSlide: true,
                slideEvery : 8000,
				afterSlideWait: 8000,
				afterUserSlideWait: 10000
            }
                 
            var options =  $.extend(defaults, options);
            //Iterate over the current set of matched elements
            return this.each(function() 
			{
				var timeoutID = null;
				var intervalID = null;
				var pos = 0;
				var last_pos = pos;
             	var o = options;

                //code to be inserted here
				var bouncer = $(this);
				bouncer.css('overflow', 'hidden');

				var bounce_box_offset = bouncer.offset();
				
				var current_bounce_item = $('div.bounce-item:eq(0)');
				var next_bounce_item = $('div.bounce-item:eq(1)');
				var prev_bounce_item = $('div.bounce-item:last');				
				
				var slide_item = next_bounce_item;
				
				var bouncer_height = bouncer.height();
				var bounce_box_height = current_bounce_item.height();
				var bounce_box_width = current_bounce_item.width();
				
				var bounce_items = $('div.bounce-item', bouncer);
				if (bounce_items.size() == 0) 
				{
					return;
				};
				
				var first_item_offset = current_bounce_item.offset();
				var position_zero = first_item_offset.top;
				var bouncer_height = bouncer.height() / bounce_items.size();
				bouncer.css('height', bouncer_height + 'px');
								
				bounce_items.css({'position':'relative'});

				var prev_link = $('.bounce-prev');
				var next_link = $('.bounce-next');
			
				var sliding = false;
				prev_link.bind('click', function()
				{
					slide(false, true);

				});
				next_link.bind('click', function()
				{
					slide(true, true);
				});
				
				// Slide function
				var slide = function(next, user_click)
				{
					if (user_click === undefined) 
					{
						user_click = false;
					};
					if (next === undefined) 
					{
						next = true;
					};
					clearInterval(intervalID);
					if (sliding) 
					{
						var st = setInterval(function()
						{
							if ( ! sliding) 
							{
								clearInterval(st);
								slide(next, user_click)
							};
						}, 100);
					};
					if (sliding) {return;};
					
					if ( ! next) 
					{
						pos--;
					}
					else
					{
						pos++;
					};
					
					if (pos >= bounce_items.size() - 1) 
					{
						pos = -1;

					}
					else if (pos < 0) 
					{
						pos = bounce_items.size() - 1;
					};

					
					slide_item = $(bounce_items.get(pos));
					var slide_item_offset = slide_item.offset();
					var bounce = function()
					{
						sliding = true;
						var new_slide_move_top = slide_item_offset.top - position_zero;
						
						// Run event
						current_bounce_item.animate({top: '+=' + bouncer_height + 'px'}, 500, 'linear', function()
						{
							slide_item.animate({top: '-=' + new_slide_move_top + 'px'}, 700)
									.animate({top: '+=' + 30  + 'px'}, 500)
									.animate({top: '-=' + 30  + 'px'}, 500, 'linear', function()
									{
										prev_bounce_item = $(bounce_items.get(pos - 1));
										current_bounce_item = $(slide_item);

										next_bounce_item = $(bounce_items.get(pos + 1));
									
										sliding = false;
										
										var wait = (user_click) ? o.afterUserSlideWait : o.afterSlideWait;
										if ( ! sliding && user_click && o.autoSlide) 
										{

											timeoutID = setTimeout(function()
											{
												clearTimeout(timeoutID);
												intervalID = setInterval(function(){
													slide();
												},o.slideEvery);
											}, wait);
										};
									});
						});
					}
					bounce();
				}
				
				if (pos == 0 && o.autoSlide) 
				{
					intervalID = setInterval(function(){
						slide();
					}, o.slideEvery);
				};
			

            });
        }
    });
     
//pass jQuery to the function,
//So that we will able to use any valid Javascript variable name
//to replace "$" SIGN. But, we'll stick to $ (I like dollar sign: ) )      
})(jQuery);