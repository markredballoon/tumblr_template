/*
========    Load posts uing ajax and the tumblr API    ========

This JS is used to load up pages using the tumblr API.
It requires general.js to be loaded before it.

*/

(function($){
    var moreToGo = true, // Are there more posts to be loaded.
        loadingThrottle = false, // Ajax throttle
        tryLoadInterval, // Loop to try load more when throttled.
        $workOutput = $('#index-output'); // output element

    var apiURI = 'http://api.tumblr.com/v2/blog/markredballoon.tumblr.com/posts', // The API URI. Change the url of the blog
        tumblrApiKey = 'cSHZf7fNXnsCu2pz0EMlBhED9MQR5fzLETyGoeFKu7vRTDahJH'; // API key. Register for one on the tumblr api site https://api.tumblr.com/console


    // For all posts that are loaded, add a data order attrbute and tabindex attribute
    var $posts = $('#index-list .post');
    $posts.each(function(index, el) {
        $(this).attr({
            'data-order': index,
            'tab-index': index
        });
    });

    /**
    * Uses AJAX to add more posts onto the page using the tumblr API See documentation here
    * @param {Integer} quantity - Number of posts to load onto the page. Max 20, Min 1.
    * @param {String} tag_name - Tag name to use. If not filtering using tags set to empty string.
    * @param {Integer} offset - What post to start at.
    * @param {String} output_element - jQuery selector of the output element.
    * @param {bool} is_homepage - Is the page the homepage or not. Used to alter the styles.
    */
    function loadMorePosts(quantity, tag_name, offset, output_element, is_homepage){

        // Checks the variables and set defaults:
        is_homepage = is_homepage === false ? false : true;
        quantity = typeof quantity === 'number' ? quantity : 20;
        tag_name = typeof tag_name === 'string' ? tag_name : '';
        offset   = typeof offset === 'number' ? offset : 0;

        // Builds get variables
        var getVariables = {
            limit: quantity,
            offset: offset,
            api_key: tumblrApiKey,
            notes_info: true,
            reblog_info: true
        };

        // Adds the tag name if one is set.
        if (tag_name.length > 0 ) {
            getVariables.tag = tag_name;
        }

        // The AJAX call
        $.ajax({
            url: apiURI, // Set in variables above
            data: getVariables, // Created at start of function
            dataType: 'jsonp',
            beforeSend: function(){
                // Throttles the AJAX calls so that they happen sequentially.
                loadingThrottle = true;
            },
            error: function(xhr, status, error) {
                // Required for this to work on IE
                console.log(xhr.status);
            },
            success: function(data){
                // Success function.


                var outputHTML = ''; // The output html is appended to this element throughout the loop.

                // If there are no more posts then set moreToGo false to prevent any more ajax attempts
                if (data.response.posts.length < quantity){
                    moreToGo = false;
                }

                // Loop through the posts in the responce
                for (var i=0; i < data.response.posts.length; i++){

                    // Puts the current post into a variable to make it easier to use.
                    var thisPost = data.response.posts[i];

                    /*
                    Adds outer wrap html for each post. 
                    This includes the type (as a class), a data-order and tab index value (to store the posts original order) and the post id as a data variable.
                    */
                    outputHTML += '<div class="post '+thisPost.type+'" data-order="'+(offset+i+1)+'" data-post-id="'+thisPost.id+'" tab-index="'+(offset+i+1)+'">';


                    // Switch is used to easily change the html output based on the post type.
                    switch (thisPost.type){

                        case 'text':

                            var title = (thisPost.title !== null && thisPost.title !== undefined ) ? '<h4>' + thisPost.title + '</h4>' : '';
                            var url = thisPost.post_url !==undefined ? thisPost.post_url : '';

                            outputHTML += '<a class="post-link" href="'+url+'">';
                            outputHTML += '<div class="post-inner">';
                            outputHTML += title;
                            outputHTML += $(thisPost.body).text(); // Removes images from the text posts.
                            outputHTML += '</div>';
                            outputHTML += '</a>';
                        
                            break;

                        case 'photo':

                            var url = thisPost.post_url !== undefined ? thisPost.post_url : '';

                            outputHTML += '<a class="post-link" href="'+url+'">';

                            outputHTML += '<div class="post-inner">';

                            // Photo and photoset posts both get output as photo posts using the API
                            // This returns true if multiple images
                            if (thisPost.photos.length > 1){

                                /* 
                                Get the photoset layout. 
                                This is represented by a single number 

                                    1121 => 100% wide image, 100% wide image, 50% wide image, 50% wide image, 100% wide image

                                Convert the number into an array of classes.
                                */ 
                            	var layoutArray = thisPost.photoset_layout.split('');

                            	var photosetClass = [];

                            	for (var j = 0; j < layoutArray.length; j++) {

                            		if (layoutArray[j] == '1'){

                            			photosetClass.push('width-full');

                            		} else if (layoutArray[j] == '2'){

                            			photosetClass.push('width-half');
                            			photosetClass.push('width-half');

                            		} else if (layoutArray[j] == '3'){

                            			photosetClass.push('width-third');
                            			photosetClass.push('width-third');
                            			photosetClass.push('width-third');

                            		}
                            	};

                                // Loop through the images in the data and add the correct class from the above loop.
                            	var thesePhotos = thisPost.photos !== undefined ? thisPost.photos : [];
                            	
                            	for (var k = 0; k < thesePhotos.length; k++) {
	                            	outputHTML += '<div class="image '+photosetClass[k]+'">';
	                            	outputHTML += '<img src="'+thesePhotos[k].alt_sizes[0].url+'">';
	                            	outputHTML += '</div>';
	                            }

                            } else {

                                // For a single image add the largest sized image
                            	var thisPhoto = thisPost.photos[0].alt_sizes[0].url !==undefined ? thisPost.photos[0].alt_sizes[0].url : '';
	                            outputHTML += '<div class="image">';
	                            outputHTML += '<img src="'+thisPhoto+'">';
	                            outputHTML += '</div>';

                            }

                            // Close off the html
                            outputHTML += '</div>';
                            outputHTML += '</a>';
                            
                            break;

                        case 'quote':

                            var citation = thisPost.source_title !== undefined ? ' &#8211; '+thisPost.source_title : '';
                            var url = thisPost.post_url !== undefined ? thisPost.post_url : '';
                            var quote = thisPost.text !== undefined ? thisPost.text : '';
                            var source = thisPost.reblogged_from_name !== undefined ? thisPost.reblogged_from_name : '';

                            if (source.length > 0){
                                // If the post has a source
                            	source = '<div class="source">(Source: ' + source + ')</div>';
                            }

                            outputHTML += '<a class="post-link" href="'+url+'">';
                            
                            outputHTML += '<div class="post-inner">';
                            outputHTML += '<blockquote cite="'+url+'">'
                            outputHTML +=  quote;
                            outputHTML += '<cite>' + citation + '</cite>';
                            outputHTML += '</blockquote>';
                            outputHTML += source;

                            outputHTML += '</div>';
                            outputHTML += '</a>';

                            break;

                        case 'link':


                            var url = thisPost.post_url !==undefined ? thisPost.post_url : '';
                            var publisher = thisPost.publisher !==undefined ? thisPost.publisher : '';
                            var thisDescription = thisPost.description !== undefined ? thisPost.description : '';
                            var title = thisPost.title !== undefined ? thisPost.title : '';
                            
                            outputHTML += '<a href="'+url+'" target="_blank">';

                            outputHTML += '<div class="post-inner">';
                            outputHTML += '<div class="host">' + publisher + '</div>';
                            outputHTML += '<div class="description">' + thisDescription +'</div>';
                            outputHTML += '<div class="name">';
                            outputHTML += title + '<span class="name-host">&#8211; '+publisher+'</span>';
                            outputHTML += '</div></div>';

                            outputHTML += '</a>';

                            break;

                        case 'video':

                            var embed = thisPost.player[2].embed_code !== undefined ? thisPost.player[2].embed_code : '';

                            outputHTML += '<div class="post-inner">';
                            outputHTML += thisPost.player[2].embed_code;
                            
                            outputHTML += '</div>';

                            break;
                    }
                    outputHTML += '</div>';
                }
                    
                // Outputs the html to the output element
                $(output_element).append( outputHTML );

                // Triggers a loadingComplete event. This triggers when the html is added to the page
                $events.trigger('ajaxComplete');

                // Stops the throttle. Allows more posts to be loaded.
                loadingThrottle = false; 

            }
        });
    };


    /**
    * Sort function that splits the posts into columns
    * @param {String} selector - jQuery selector for the posts to be sorted.
    */
    function splitUpPosts(selector){

        // Caches $posts in variable
        var $posts = $(selector),
            heightArray = [];

        // Selects the appropriate column layout based on the screen size.
        if (currentScreenSize === 'lg'){
        	heightArray = [
        		parseInt($('#index-column-1').attr('data-height')),
	        	parseInt($('#index-column-2').attr('data-height')),
	        	parseInt($('#index-column-3').attr('data-height')),
	        	parseInt($('#index-column-4').attr('data-height'))
	        ]

        } else if (currentScreenSize === 'sm' || currentScreenSize === 'md'){
        	heightArray = [
        		parseInt($('#index-column-1').attr('data-height')),
	        	parseInt($('#index-column-2').attr('data-height')),
	        	parseInt($('#index-column-3').attr('data-height'))
	        ]
        } else if (currentScreenSize === 'xs'){
			heightArray = [1];
        }


        // Get the data-order value for the first post.
        var firstPost = parseInt($posts.eq(0).attr('data-order'));

        // Loop through all of the posts and use $.appendTo to add them to the correct column.

        for (var i = 0; i < $posts.length; i++) {
            // Cache the current element
			var $thisElement = $(selector + '[data-order=' + (i + firstPost) + ' ]')

        	if (heightArray.length == 1){
                // If there is only one column add the element the single column
        		$thisElement.appendTo('#index-column-1');

        	} else {
                // Finds the shortest column
        		var shortest = 0;
        		for (var j = 0; j<heightArray.length; j++){
        			shortest = (heightArray[shortest] <= heightArray[j]) ? shortest : j;
        		}

                // Adds the elemeent to the shortest column
        		$thisElement.appendTo('#index-column-'+(shortest+1));

                // Updates the height array for the new element
        		heightArray[shortest] = heightArray[shortest] + $thisElement.height();

        	}
        }
        requestAnimationFrame(function(){

            // Update the data-height attribute for each column
        	$('#index-column-1').attr('data-height', $('#index-column-1').height());

        	$('#index-column-2').attr('data-height', $('#index-column-2').height());

        	$('#index-column-3').attr('data-height', $('#index-column-3').height());

        	$('#index-column-4').attr('data-height', $('#index-column-4').height());

        });
    }


    $events.on('ajaxComplete', function(){
        setTimeout(function(){
        	$events.trigger('custom:resize');
           	splitUpPosts('#index_output .post'); 
        }, 1000);
    });


    // Hook into the custom scroll event and if any of the columns are at the end of the screen then trigger the reached end event
    $events.on('custom:scroll', function(){
        $('.index-column','#columns-wrap').each(function(index, el) {
            if ( this.getBoundingClientRect().bottom < 0 ) {
                $events.trigger('reached_end');
            };
        });
    });

    // Try load posts when reached end event is triggered
    $events.on('reached_end', function(){
        if (moreToGo){
            clearInterval(tryLoadInterval);
            tryLoadInterval = setInterval(function(){
                if(!loadingThrottle){
                    clearInterval(tryLoadInterval);
                    loadMorePosts(4, false, $('.post').length, '#index_output', false );
                }
            }, 200);
        };
    });

    // Triggers when the page is fully loaded
    // It is triggered every time new posts are finished loading
    var firstLoad = true;
    $window.on('load', function(){
        if (firstLoad === true) {
            splitUpPosts('#index-list .post');

            var lastScreenSize = currentScreenSize;

            $events.on('custom:resize', function(){

                // Checks if the current screen size is the same as the previous screen size.
                if (lastScreenSize !== currentScreenSize){

                    lastScreenSize = currentScreenSize;

                    $('#columns-wrap .index-column').attr('data-height', 0);

                    splitUpPosts('#index-list .post');

                }
            });
        } 
        firstLoad = false;

        // Fire after everything is loaded:
        $events.trigger('custom:resize');
        $events.trigger('custom:scroll');
        
    });

})(jQuery);