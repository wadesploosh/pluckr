
$(document).ready(function(){
	$(function() {
    	FastClick.attach(document.body);
	});

	$('.userTweetsOption').click(function(){
		$('.hashtagOption').hide();
		$('.decision-container').addClass('onStandby');
		$('.back-btn').fadeIn('fast');
	});

	$('.hashtagOption').click(function(){
		$('.userTweetsOption').hide();
		$('.decision-container').addClass('onStandby');
		$('.back-btn').fadeIn('fast');
	});

	$('.back-btn').click(function(){
		$('.userTweetsOption, .hashtagOption').fadeIn('fast');
		$('.decision-container').removeClass('onStandby').removeClass('isActive');
		$(this).fadeOut(1000);
	});

	$('.more-toggle').click(function(){
		$(this).hide();
		$('.less-toggle').show();
		$('.more-info').toggleClass('active');
	});

	$('.less-toggle').click(function(){
		$(this).hide();
		$('.more-toggle').show();
		$('.more-info').toggleClass('active');
	});


	// This is what happens when clicking the SEARCH FOR NAMES button
	$('#userSearch').click(function(){		
		$('.decision-container').removeClass('onStandby').addClass('isActive').addClass('hasSearched');
		$('.user-info-wrapper').addClass('active');

		var twitterName = $('#twittername').val();
		var countNumber = $('#countamount').val();

		function listTweets(data) {
			var name; // Declare these here so we can get them out again when needed
			var thumbnail;
			var profileBanner;
			var location;
			var description;
			var verified;
			var screenName;

			var output = '<ul>';
			$.each(data, function(key, val){
				var text = data[key].text;
				var createdAt = data[key].created_at;
				
				createdAt = createdAt.substring(0, createdAt.length - 20) + ' 2015';
				thumbnail = data[key].user.profile_image_url;
				name = data[key].user.name;
				screenName = data[key].user.screen_name;
				profileBanner = data[key].user.profile_banner_url;
				location = data[key].user.location;
				description = data[key].user.description;
				verified = data[key].user.verified;

				// Convert URLs into clickable links
				text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(i){
					var url = i.link(i);
					return url;
				});

				// Convert @mention into clickable links
				text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(i){
					var item = i.replace('@','');
					var url = i.link('http://twitter.com/' + item);
					return url;
				});

				// Convert #tag into clickable links
				text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(i){
					var item = i.replace('#','');
					var url = i.link('http://twitter.com/' + item);
					return url;
				});
				
				output += '<li>';
				output += '<p class="tweet-text">' + text + '</p>';
				output += '<p class="timestamp">' + createdAt + '</p>';
				output += '</li>';

				return name;
				return screenName;
				return thumbnail;
				return profileBanner;
				return location;
				return description;
				return verified;

			}); // Go through each data
			output += '</ul>';

			$('.userTweetsOption .showing').html('<p>Showing <b>' + countNumber + '</b> results for <b>' + name + '</b></p>');
			$('.userTweetsOption .profile-image').html('<img src="'+ thumbnail + '" alt="photo of ' + name + '">');
			$('.userTweetsOption .searchedName').html('<p><b>' + name + '</b><span class="verified"></span></p>' + '<br>' + '<p class="twitter-handle">@' + screenName + '</p>');

			if(location.length === 0) {
				$('.userTweetsOption .more-toggle').hide();
			} else {
				$('.userTweetsOption .more-toggle').show().html('<p>More...</p>');
			};

			if (profileBanner == null) {
				$('.userTweetsOption .profile-banner').html('<img src="img/placeholder.jpg">');

			} else {
				$('.userTweetsOption .profile-banner').html('<img src="'+ profileBanner + '" alt="photo of ' + name + '">');
			};

			if (verified == true){
				$('.verified').show();
			};

			$('.userTweetsOption .searchedDescription').html('<p>' + description + '</p>');
			$('.userTweetsOption .searchedLocation').html('<p>Location: ' + location + '</p>');

			$('#tweetlist').html(output);
		}; // listTweets

		$.getJSON('scripts/tweets_json.php?count=' + countNumber + '&screen_name=' + twitterName, function(data) {
			listTweets(data);
			$('#tweetlist').trigger('create');
		});
	});


	// This is what happends when clicking the SEARCH FOR HASHTAGS button
	$('#hashtagSearch').click(function(){	
		$('.decision-container').removeClass('onStandby').addClass('isActive').addClass('hasSearched');	
		
		var hashtag = $('.hashtagOption  #hashtag').val();
		var countNumber = $('.hashtagOption #countamountHashtag').val();

		function listTweets(data) {
			var output = '<ul>';
			var newName;

			for(var i = 0; i < countNumber; i++) {
				var obj = data.statuses[i];
				var text = obj.text;
				var thumbnail = obj.user.profile_image_url;
				newName = obj.user.screen_name;

				// Convert URLs into clickable links
				text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(i){
					var url = i.link(i);
					return url;
				});

				// Convert @mention into clickable links
				text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(i){
					var item = i.replace('@','');
					var url = i.link('http://twitter.com/' + item);
					return url;
				});

				// Convert #tag into clickable links
				text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(i){
					var item = i.replace('#','');
					var url = i.link('http://twitter.com/#' + item);
					return url;
				});

				output += '<li>';
				output += '<img class="profile-pic" src="'+ thumbnail + '" alt="photo of ' + newName + '">';
				output += '<p class="tweet-text">' + text + '</p>';
				output += '<p class="twitter-handle">@' + newName + '</p>';
				output += '</li>';
				
			}; // Go through each data
			output += '</ul>';

			$('.hashtagOption .showing').html('<p>Showing <b>' + countNumber + '</b> results for <b>#' + hashtag + '</b></p>');

			$('#hashtags').html(output);
		}; // listTweets
		
		$.getJSON('scripts/tags_json.php?q=%23' + hashtag + "&count=" + countNumber, function(data) {
			listTweets(data);
			$('#tweetlist').trigger('create');
		});
	});
});