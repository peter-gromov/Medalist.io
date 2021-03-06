countInterests = function(){
	return $('.interests-button-selected:visible').length;
};

/*effects */
blinkNew = function( className ){
	var cBlink = '#8a44ff',
		h = $('<div></div>');
	console.log(className);
	if( typeof className == 'string' ){
		className = $(className);
	}

	console.log(className);
	console.log(className.length);

	className.css('position', 'relative');
	h.css('background-color', cBlink);
	h.css('width', '100%');
	h.css('height', '100%');
	h.css('left', '0');
	h.css('right', '0');
	h.css('position', 'absolute');
	h.css('z-index', '100');

	className.prepend(h);
	className.removeClass('ajax-prepended');
	h.animate({'opacity': 0}, 500, function(){ h.remove();});


	return false;
};


checkAlarms = function(){
	$.ajax({
		url: ajaxUrls['alarmCheckNew'],
		type: 'get',
		success: function(html){
			if( $('#notifications').length > 0 ){
				$('#notifications .notifications-blocks').prepend( html );


				if( html != ''){
					window.scrollTo(0, 0);
					 $('#notifications').fadeIn();
					 $('.userpanel-user-notifications').addClass('active');
				}
			}
		}
	});
};

setInterval(checkAlarms, 5000);


pushTagsToAdded = function( fieldFrom, container){
	var val = '';

	if( typeof fieldFrom == 'string'){
		fieldFrom = $(fieldFrom);
	}
	if( typeof container == 'string'){
		container = $(container);
	}

	val = fieldFrom.val();

	val = val.split('#').join('');

	if( val.length > 0 ){
		container.append('<div class="  mdlst-button mdlst-button-default addach-tags-tag"  >'+val+'<div class="mdlst-button-closer "></div></div>');
		 
	}
};


$(document).ready(function(){


	/* MOBILE */
	$('.js-toggle-mobilemenu').click(function(){
		if( $('.mobile_menu_toggle').hasClass('mobile_menu_toggle__active') ){
			$('.mobile_menu_toggle').removeClass('mobile_menu_toggle__active');
		}else{
			$('.mobile_menu_toggle').addClass('mobile_menu_toggle__active');
		}
	});
		/* MOBILE END*/

	/*effects end */

	/* REGISTRATION */

		/* interests selector */
		var interestForReward = 7;
		var loadInterestChildren = function( interest_id ){
			if (typeof interest_id == 'undefined') { return false ;}

			console.log( interest_id );

			$.ajax({
				url: $('input[name=childInterestsUrl]').val(),
				data: { interest_id: interest_id },
				type: 'get',
				dataType : 'json',
				success: function(data){
					var dummy = '';
						
					for( var k in data.children ){

						dummy = $('<div class="interests-button mdlst-button js-interest-selector-takeinterest"></div>');
						dummy.text( data.children[k].name );
						//dummy.addClass( "h-interest-" + data.children[k].interest_id);
						dummy.data('id', data.children[k].interest_id);
						 console.log( dummy.data('id'));
						
						$('.interests-selector').append(dummy);
					}

					EventEngine.registerEventFromRawAjax (data);

 
				}
			})
		};


		var checkIfInterestCompleted = function(){
			var count = $('.interests-button-selected').length,
				needed = interestForReward;

				return (count >= needed);
		}

		var curtainReward = function(){
			if( checkIfInterestCompleted() ){
				//Showing Reward
				$('.h-interests-before-reward').stop().slideUp();
				$('.h-interests-after-reward').stop().slideDown();
			}else{
				//Showing Back
				$('.h-interests-before-reward').stop().slideDown();
				$('.h-interests-after-reward').stop().slideUp();
			}
		}

		$(document).on('click', '.js-interest-selector-takeinterest', function(){
			var text = $(this).text(),
				id = $(this).data('id'),
				childLoaded = $(this).data('childloaded'),
				handler = $('.interests-selector-selected'),
				dummy = $('<div class="interests-button-selected mdlst-button">'+text+' <div class="mdlst-button-closer js-interest-selector-removeinterest"></div></div> '),
				track = $('.interests-selector-scale-track');

			console.log('taken id ' + id );

			dummy.data('id', id);
			dummy.css('display', 'none');

			handler.append( dummy );
			dummy.fadeIn(function(){track.css('margin-left', '-'+((interestForReward-countInterests())/interestForReward)*100+'%' );});
			console.log( 'attached id ' + dummy.data('id') );
		 
			if( typeof childLoaded == 'undefined'){
			 
				loadInterestChildren( id );
				$(this).data('childloaded', true);
			}
			$(this).fadeOut();
			curtainReward();
			 

		});

		$(document).on('click', '.js-interest-selector-removeinterest', function(){
			var p = $(this).parents('.interests-button-selected'),
				id = p.data('id'),
				track = $('.interests-selector-scale-track');

			console.log(' removing id ' + id );
					 
			p.fadeOut(function(){track.css('margin-left', '-'+ ((interestForReward-countInterests())/interestForReward)*100+'%' ); p.remove(); curtainReward();});
			$('.js-interest-selector-takeinterest').filter(function(){ return $(this).data("id") == id  }).fadeIn();
			 
			console.log($('.js-interest-selector-takeinterest[data-id="'+id+'"]').length);
			console.log('.js-interest-selector-takeinterest[data-id="'+id+'"]');
			
		});








		$(document).on('click', '.js-quick-register', function(){
			var p = $(this).parents('form.pregister-form'),
				action = p.attr('action'),
				email = p.find('input[name=email]'),
				_csrf = p.find('input[name=_csrf]');
				successUrl = p.find('input[name=successUrl]');

				console.log(  email.val());

				$.ajax({
					type: 'post',
					url: action ,
					data: {email: email.val(), _csrf : _csrf.val()},
					dataType : 'json',
					success: function( data ){

						if( data.success ){
							console.log('123')
							document.location.href =   successUrl.val();
						}


						EventEngine.registerEventFromRawAjax (data);
					}
				});

				return false;
		});

		/* Изменение пароля */
		$(document).on('click', '.js-set-password', function(){
			var p = $(this).parents('form.pregister-form'),
				action = p.attr('action'),
				password = p.find('input[name=password]'),
				_csrf = p.find('input[name=_csrf]');
				successUrl = p.find('input[name=successUrl]');

				 console.log('123');
				 console.log(password.val());
				 console.log(action);
				 console.log(_csrf.val());
				 console.log(successUrl.val());

				$.ajax({
					type: 'post',
					url: action ,
					data: {password: password.val(), _csrf : _csrf.val()},
					dataType : 'json',
					success: function( data ){
						console.log(data);
						if( data.success ){
							console.log('123');
							document.location.href =   successUrl.val();
						}
						EventEngine.registerEventFromRawAjax (data);
					}
				});

				return false;
		});

		/* Изменение пароля */
		$(document).on('click', '.js-register-save-interests', function(){
			var p = $(this).parents('form.pregister-form'),
				action = p.attr('action'),
				_csrf = p.find('input[name=_csrf]'),
				interests = [];

				$('.interests-button-selected').each(function(i,e){
 					interests[interests.length] = $(e).data('id');
				});

				console.log( interests );

			 
				

				
				$.ajax({
					type: 'post',
					url: action ,
					data: {interests: interests, _csrf : _csrf.val()},
					dataType : 'json',
					success: function( data ){
						console.log(data);
					 
						if( data.success ){
							 
							document.location.href =   data.returnUrl;
						}
						EventEngine.registerEventFromRawAjax (data);
					}
				});

				return false;
		});



	/* . REGISTRATION END */


		/* invite friends */
		window.validateEmail = function(e){
			
			var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			if (e == '' || !re.test( e ))
			{
			    
			    return false;
			}else{
				return true;
			}

		};
		window.inviteFriendsCalcPoints = function(){
			var c = $('.js-invitefriends-emaillist'),
				list = c.find('.js-friendemail-block'),
				length = list.length;

				return length;
		};
		window.inviteFriendsRewriteTotalPoints = function ( calc ){
			$('.invitefriends-widget-screen-2-sum span').text((calc*10));
		};
		window.inviteFriendsAddEmail = function(email, destinationClass){
			var e = '<div class="  mdlst-button mdlst-button-default js-friendemail-block addach-tags-tag">'+email+'<div class="mdlst-button-closer "></div></div><br>';
			if( typeof destinationClass != 'object'){
				destinationClass = $(destinationClass);
			}
			destinationClass.append(e);
			window.inviteFriendsRewriteTotalPoints ( window.inviteFriendsCalcPoints()  );
		};

		window.inviteFriensCountEmails = function( destinationClass){
			if( typeof destinationClass != 'object'){
				destinationClass = $(destinationClass);
			}
			return $(destinationClass).find('.js-friendemail-block').length;
		};

		$(document).on('focus', '.js-invitefriends-input', function(){
			var p = $(this).parents('.invitefriends-widget'),
				title1 = p.find('.invitefriends-widget-screen-1-titleblock1'),
				title2 = p.find('.invitefriends-widget-screen-1-titleblock2');

			$('.invitefriends-widget-screen-2').slideDown();
			title1.slideUp();
			title2.slideDown();
		});
		$(document).on('blur', '.js-invitefriends-input', function(){
			var p = $(this).parents('.invitefriends-widget'),
				title1 = p.find('.invitefriends-widget-screen-1-titleblock1'),
				title2 = p.find('.invitefriends-widget-screen-1-titleblock2');

			if( window.inviteFriendsCalcPoints() == 0 && $('.js-invitefriends-input').val().length == 0 ){
				title1.slideDown();
				title2.slideUp();	
			}
			
		});
		$(document).on('keydown', '.js-invitefriends-input', function( e ){
			var p = $(this).parents('.invitefriends-widget'),
				val = $(this).val();

				if( e.which == 13 || e.which == 188){
					e.preventDefault();
					if( window.validateEmail(val) ){
						window.inviteFriendsAddEmail( val, p.find('.js-invitefriends-emaillist') );	
					}
					
					$(this).val('');
				}

		});
		$(document).on('click', '.js-invitefriends-addemail', function(){
			var e = jQuery.Event("keydown");
			e.which = 188; // # Some key code value
			$('.js-invitefriends-input').trigger(e);

			//$('.js-invitefriends-input').keydown(13);
		});
		$(document).on('click', '.js-invitefriends-invite', function(){
			 var emails = $('.js-friendemail-block'),
			 		toInvite = [],
			 		that = this;
			 emails.each(function(i,e){
			 	toInvite[ toInvite.length ] = $(e).text();
			 	
			 });

			 $(this).addClass('mdlst-button-disabled');
			 $.ajax({
			 	url :ajaxUrls['inviteFriends'],
			 	data: {emails: toInvite},
			 	dataType: 'json',
			 	success: function(data){
			 		console.log(data);
			 		$(that).removeClass('mdlst-button-disabled');
			 		$('.invitefriends-widget-screen-1').slideUp();
			 		$('.invitefriends-widget-screen-2').slideUp();
			 		$('.invitefriends-widget-screen-3').slideDown();
			 	}
			 });
		});
		/* invite friends end */





		/* QUESTS ====================*/

		window.fireNewBadgePopup = function(data){
			var popup = $('.rewardpopup');

			popup.find('.rewardpopup-form-pic img').attr('src', data.picture);
			popup.find('.rewardpopup-form-text').text(data.description);
			popup.find('.mdlst-button').text('+' + data.points + ' ' + data.scale);
			popup.fadeIn();
		};

		var pushNewQuestChallenge = function() {};

		//Выводит блок
		var pushNewQuestPending = function(quest_id) {
			$.ajax({
				url: ajaxUrls['getQuestPendingTaskHtml'],
				data: {quest_id:quest_id},
				dataType: 'json',
				success: function(data){
					var h = $(data.html);
					h.css('display', 'none');
					$('.questpending-wrapper').append( h );
					h.slideDown();
					$('.h-quest-pendint-tasks-title').slideDown();
				}
			});

		};

		//Взять квест
		$(document).on('click', '.js-quest-takequest', function(){
			var p = $(this).parents('.questblock'),
				id = $(this).data('id');
				 
		 	
				$.ajax({
					url: ajaxUrls['takeQuest'],
					data: { quest_id : id},
					dataType: 'json',
					success: function(data){
						//TODO Success
						pushNewQuestPending( id );
						p.slideUp();

							$('.addach').slideUp();
							$('.addach-success').slideDown();


						EventEngine.registerEventFromRawAjax (data);
					}

				});
 
			
		});




		//Принять вызов
		$(document).on('click', '.js-quest-acceptchallenge', function(){
			var p = $(this).parents('.questssuggested-quests-quest'),
				pp = $(this).parents('.questssuggested'),
				quest_id = $(this).data('quest_id'),
				quest_challenge_id = $(this).data('quest_challenge_id');
				 
		 	
				$.ajax({
					url: ajaxUrls['takeQuest'],
					data: { quest_id : quest_id,  quest_challenge_id : quest_challenge_id },
					dataType: 'json',
					success: function(data){
						//TODO Success
						pushNewQuestPending( quest_id );
						p.slideUp( function(){ p.remove(); 
							if( pp.find('.questssuggested-quests-quest').length == 0 ){
								pp.slideUp(function(){ pp.remove(); });
							}
						});

						EventEngine.registerEventFromRawAjax (data);
					}

				});
 
			
		});
		//Принять вызов
		$(document).on('click', '.js-quest-refusechallenge', function(){
			var p = $(this).parents('.questssuggested-quests-quest'),
				pp = $(this).parents('.questssuggested'),	
				quest_id = $(this).data('quest_id'),
				quest_challenge_id = $(this).data('quest_challenge_id');
				 
		 	
				$.ajax({
					url: ajaxUrls['refuseQuestChallenge'],
					data: { quest_id : quest_id,  quest_challenge_id : quest_challenge_id },
					dataType: 'json',
					success: function(data){
						//TODO Success
						 
						p.slideUp( function(){ p.remove(); 
							if( pp.find('.questssuggested-quests-quest').length == 0 ){
								pp.slideUp(function(){ pp.remove(); });
							}
						});

						EventEngine.registerEventFromRawAjax (data);
					}

				});
 
			
		});


		//Взять квест
		$(document).on('click', '.rewardpopup-bg', function(){
			var p = $(this).parents('.rewardpopup');
				 
		 	 p.fadeOut();
			
		});

		/* . END QUESTS ====================*/


		/* ACHIEVEMENT */
		$('.js-addach-isdifficult').hide();
		console.log($('[data-toggle="rangeslider"]').rangeslider({ polyfill: false }));
		$('.addach-description-text-textarea').trumbowyg(  );
		$('[data-toggle="datepicker"]').datepicker( {format: 'dd.mm.yyyy'});
		$('[data-toggle="datepicker"]').each(function(i,e){
			if( $(e).val() == '' ){
				$(e).datepicker("setDate", "0");
			}
		});



		if( $('[data-toggle="dropzone"]').length > 0 ){
			myDropzoneFiles = [];
			myDropzone = new Dropzone(
				'[data-toggle="dropzone"]',
				{
					url: 'http://' + window.location.hostname + "/index.php?r=site/ajax-upload-image",
				        success: function(file, response) {
							file.fid = myDropzoneFiles.length;
							myDropzoneFiles[ myDropzoneFiles.length ] = response;
					        if (file.previewElement) {
					          return file.previewElement.classList.add("dz-success");
					        }
				      },

				      removedfile: function(file) {
				        var _ref;

						myDropzoneFiles[file.fid] = "";

				        if (file.previewElement) {
				          if ((_ref = file.previewElement) != null) {
				            _ref.parentNode.removeChild(file.previewElement);
				          }
				        }
//					alert(myDropzoneFiles);

				        return this._updateMaxFilesReachedClass();
				      },

					init: function() {
						var thisDropzone = this;
						var data = $('#uploadHolder').attr('data-preloadedPhotos');
						if( typeof data != 'undefined'){	
							if( data.length > 0 ){
								var mas = data.split(',');
					           		$.each(mas, function(key,value){ //loop through it
									var nameSize = value.split('|');
			        				        var mockFile = { name: nameSize[0], size: nameSize[2], fid:  myDropzoneFiles.length}; // here we get the file name and size as response 
		
					                		thisDropzone.options.addedfile.call(thisDropzone, mockFile);
							    		thisDropzone.emit('complete', mockFile);
		                                		        thisDropzone.files.push(mockFile); 
									thisDropzone.createThumbnailFromUrl(mockFile, nameSize[1]);
							myDropzoneFiles[ myDropzoneFiles.length ] = nameSize[0];
					            		});
					          	};
						}
//					alert(myDropzoneFiles);
					}




				}
			);

		}
		 
		
		console.log( $('[data-toggle="rangeslider"]').rangeslider('update', true) );
 
		$(document).on('change', 'input[name="addach-chk-isimportant"]', function(e ){
			console.log('123');
		 	if( $(this).is(":checked")) {
				$('.js-addach-isdifficult').show();
				$('.js-addach-isdifficult-h').hide();
		 	}else{
		 		$('.js-addach-isdifficult').hide();
		 		$('.js-addach-isdifficult-h').show();
		 	}
		});

		if ( $('input[name=difficult]').length > 0  ){
			$('.js-addach-isdifficult').show();
			$('.js-addach-isdifficult-h').hide();
		}



		//Взять квест
		$(document).on('click', '.js-add-achievement', function(){
			var p = $(this).parents('.addachievement-form'),
				name = p.find('input[name="name"]'),
				description = p.find('textarea[name="description"]'),
				difficulty = p.find('input[name="difficulty"]'),
				difficult = p.find('input[name="addach-chk-isimportant"]'),
				entity = p.find('[name="entity"]'),
				date_achieved = p.find('[name="date_achieved"]'),
				tags = [],
				tagWords = [],
				_csrf = p.find('input[name=_csrf]'),
				data = {}
				;



				pushTagsToAdded(p.find('input.js-tag-adder'), p.find('.addach-tags-w'));
				tags = p.find('.addach-tags-w .addach-tags-tag');

				

				tags.each(function(i,e){
					tagWords[ tagWords.length ] = $(e).text();
				});

				data['name'] = name.val();
				data['description'] = description.val();
				data['difficulty'] = difficulty.val();
				data['difficult'] = ( difficult.attr("checked") == 'checked' ?1:0);
				data['date_achieved'] = date_achieved.val();
				data['entity'] = entity.val();
				data['interests'] =  tagWords;
				data['files'] =  myDropzoneFiles;
				data['_csrf'] = _csrf.val();
		 	
				$.ajax({
					url: ajaxUrls['addAchievement'],
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(data){
						console.log(data);

						if( data.success ){
							$('.addach').slideUp();
							$('.addach-success').slideDown();
						}
						myDropzoneFiles = [];

						EventEngine.registerEventFromRawAjax (data);
					}

				});

				return false;
 
			
		});



		//Взять квест
		$(document).on('click', '.js-update-achievement', function(){
			var p = $(this).parents('.addachievement-form'),
				name = p.find('input[name="name"]'),
				achievement_id = p.find('input[name="achievement_id"]'),
				description = p.find('textarea[name="description"]'),
				difficulty = p.find('input[name="difficulty"]'),
				difficult = p.find('input[name="addach-chk-isimportant"]'),
				entity = p.find('[name="entity"]'),
				date_achieved = p.find('[name="date_achieved"]'),
				tags = [],
				tagWords = [],
				_csrf = p.find('input[name=_csrf]'),
				data = {}
				;

				

				pushTagsToAdded(p.find('input.js-tag-adder'), p.find('.addach-tags-w'));
				tags = p.find('.addach-tags-w .addach-tags-tag');

				

				tags.each(function(i,e){
					tagWords[ tagWords.length ] = $(e).text();
				});

				data['name'] = name.val();
				data['description'] = description.val();
				data['difficulty'] = difficulty.val();
				data['difficult'] = ( difficult.attr("checked") == 'checked' ?1:0);
				data['date_achieved'] = date_achieved.val();
				data['entity'] = entity.val();
				data['achievement_id'] = achievement_id.val();
				data['interests'] =  tagWords;
				data['files'] =  myDropzoneFiles;
				data['_csrf'] = _csrf.val();
				 
		 	
				$.ajax({
					url: ajaxUrls['updateAchievement'],
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(data){
						console.log(data);

						if( data.success ){
							$('.addach').slideUp();
							$('.addach-success').slideDown();
						}
						myDropzoneFiles = [];

						EventEngine.registerEventFromRawAjax (data);
					}

				});

				return false;
 
			
		});



		//Удалить достижение
		$(document).on('click', '.js-delete-achievement', function(){
			if( confirm('Вы точно хотите удалить это достижение?') ){
				document.location.href = $(this).data('delete_url');
			}else{
				return false;
			}
		});


		/* бросить вызов */
		$(document).on('click', '.js-questchallenge-select-user', function(){
			var user_id = $(this).data('user_id');

			if( $(this).hasClass('mdlst-button-disabled') ){
				 $(this).removeClass('mdlst-button-disabled');
				 $(this).removeClass('checked');
				 $(this).text('Бросить вызов');
			}else{
				 $(this).addClass('mdlst-button-disabled');
				 $(this).addClass('checked');
				 
				 $(this).text('Снять выбор');
			}
		});

		$(document).on('click', '.js-questchallenge-send', function(){
			var selected = $('.js-h-questchallenge-user.checked'),
				_csrf = $('[name=_csrf]'),
				quest_id = $('[name=quest_id]'),
				user_ids = [];


				selected.each( function(i,e){
					user_ids[user_ids.length] = $(e).data('user_id');
				}); 

				console.log( user_ids );

				$.ajax({
					url: ajaxUrls['questChallengeSend'],
					data: {user_ids : user_ids, _csrf: _csrf.val(), quest_id: quest_id.val()},
					type: 'post',
					dataType: 'json',
					success: function( data ){
						console.log(data);
						if( data.success ){
							$('.js-h-quest-sended').slideUp();
							$('.js-h-quest-sended-success').slideDown();
						}
					}
				});
		});






		/* бросить вызов end */



		/* ACHIEVEMENT END */


		/* CONTROLLS */
		$(document).on('click','.mdlst-switch', function(){
			var check = $(this).find('input');

			if( $(this).hasClass('mdlst-switch-on') ){
				$(this).removeClass('mdlst-switch-on');
				check.attr('checked', false);
				check.change();
			}else{
				$(this).addClass('mdlst-switch-on');
				check.attr('checked', 'checked');
				check.change();
			}

		});

		$(document).on('change', '.dropdown-select select', function(){
			var o = $(this).find('option:checked'),
				t = o.text(),
				p = $(this).parents('.dropdown-select'),
				tH = p.find('.dropdown-select-block-text');

				tH.text(t);
		});
		$('.dropdown-select select').change();




		


		$(document).on('keydown', '.js-tag-adder', function( e ){
		 	var  v = $(this).val();

		 	v = v.split('#').join('');

			if( e.which == 13 ||  e.which == 188 ){
				e.preventDefault();
				if( v.length > 0 ){
					$(this).val('');
					$('.addach-tags-w').append('<div class="  mdlst-button mdlst-button-default addach-tags-tag"  >'+v+'<div class="mdlst-button-closer "></div></div>');
	
				}else{
					$(this).val('');
				}
				
			}
		});


		
		/* . CONTROLLS END ===================== */


		/* LIKES */
		$(document).on('click', '.js-add-like', function(){
			var p = $(this).parents('.like-controll'),
				className = p.data('obj'),
				classId = p.data('id'),
				point = $(this).data('point'),
				data =  {entity_class : className, entity_id: classId, point: point},
				that = this;

				//FrontEnd check
				if( window.isGuest == 1 ){
					return false;
				}

				$.ajax({
					url: ajaxUrls['addLike'],
					data: data,
					type: 'get',
					dataType: 'json',
					success: function(data){
						console.log(data);
						p.find('.js-add-like').removeClass('like-controll-active');
						$(that).addClass('like-controll-active');

						$.ajax({
							url: ajaxUrls['getLikes'],
							data: { entity_class : className, entity_id: classId },
							type: 'get',
							dataType: 'json',
							success: function(data){
							 p.find('.like-controll-plus').html('<span></span>'+data.likes);
							 p.find('.like-controll-minus').html('<span></span>'+data.dislikes);
							}
						});
					}

				})
		});
		/* LIKES END ================== */

		/* COMMENTS */
		var prependComment = function( viewport, commentId, parentCommentId ){
			var html = '';

			//It is an answer - find proper answer section
			if( typeof parentCommentId != 'undefined' && parseInt(parentCommentId) > 0){
				viewport = viewport.find('.comment-id-'+parentCommentId+' .comment-block-answers');
			}

			$.ajax({
				url: ajaxUrls['getCommentHtml'],
				data: {comment_id: commentId, parent_comment_id: parentCommentId },
				success: function(data){

				 
					html = data;
					html = $(html);

					if( typeof viewport == 'string'){
						viewport = $(viewport);
					}

					
					viewport.prepend( html );

					blinkNew( '.ajax-prepended' );

				 
				}
			});

			return html;
		 
		}


		
		$(document).on('click', '.js-clear-parent-comment', function(){

			p = $(this).parents('.form-add-comment'),
				className = p.data('obj'),
				whome = p.find('.form-add-comment-towhome'),
				classId = p.data('id'),
				inp =p.find('.parent_comment_id');


			whome.slideUp();
			inp.val(0);

		});
		$(document).on('click', '.js-add-comment', function(){
			var p = $(this).parents('.form-add-comment'),
				className = p.data('obj'),
				classId = p.data('id'),
				parent_comment_id = p.find('.parent_comment_id').val(),
 				comment = p.find('textarea').val(),
 				err = p.find('.form-add-comment-error'),
				data =  {entity_class : className, entity_id: classId, text: comment, parent_comment_id, parent_comment_id},
				that = this;

				if( comment.length < 10 ){
					err.text('Комментарий слишком короткий');
					err.slideDown();
					return false;
				}
 

				$.ajax({
					url: ajaxUrls['addComment'],
					data: data,
					type: 'get',
					dataType: 'json',
					success: function(data){
						var html;
						console.log(data);
						if( data.success ){
							prependComment( $('.questblock-comments-quest-' + classId + ' .questblock-comments-form-wrapper'), data.comment_id, data.parent_comment_id );	
							console.log('222');
							console.log( $('.ajax-prepended').length );
							


							p.find('textarea').val('');
						}else{
							err.text( data.error );
							err.slideDown;
						}
						
						 
					}

				});

				return false;
		});



		$(document).on('click', '.js-comment-makeresponse', function(){
			var p = $(this).parents('.comments-widget'),
				curComment = $(this).parents('.comment-block-data'),
				name = curComment.find('.comment-block-data-user-name-link').text(),
				form = p.find('.form-add-comment'),
				whome = form.find('.form-add-comment-towhome');

				form.find('.parent_comment_id').val( $(this).data('id') );
				form.find('textarea').focus();

				whome.slideDown();
				whome.find('.form-add-comment-towhome-response-name').text(name);

				//TODO - add label that "Your answer too..."

				 

				return false;
		});


		/* COMMENTS END ================== */


		/* PROFILE UPDATE */
		$(document).on('click', ".js-update-profile-show", function(){
			$('.profileview-content-view').slideUp();
			$('.profileview-edit').slideDown();
		});
		/* PROFILE UPDATE END */



		/* OWL SLIDER */
            $(document).ready(function() {
              var owl = $('.owl-carousel');
              owl.owlCarousel({
                items: 1,
                loop: true,
                margin: 0,
                autoplay: true,
                autoplayTimeout: 15000,
                autoplayHoverPause: false,
				nav: false,
				dots:false
				

              });
              $('.play').on('click', function() {
                owl.trigger('play.owl.autoplay', [15000])
              })
              $('.stop').on('click', function() {
                owl.trigger('stop.owl.autoplay')
              })
            })
		/* OWL SLIDER END */




		/* ALARMS */
		$('.userpanel-user-notifications').click(function(){
			var notifications = $(this).find("#notifications");

			notifications.fadeIn();
		});


		$(document).mouseup(function(e) 
		{
			var container = $("#notifications");

			// if the target of the click isn't the container nor a descendant of the container
			if (!container.is(e.target) && container.has(e.target).length === 0) 
			{
				container.fadeOut();
			}
		});

		/* ALARMS END */




 
		/* SHARE REWARDS */
		$('.ya-share2__link').on('click', function(){
			var p = $(this).parents('.repost-points-wrapper'),
				entity_class = p.data('entity_class'),
				entity_id = p.data('entity_id');
				 
			$.ajax({
				url: ajaxUrls['shareTrack'],
				data: {  entity_class: entity_class, entity_id: entity_id},
				dataType: 'json',
				success: function(data){
					console.log(data);
				}
			});
		});
		/* SHARE REWARDS END*/





});

