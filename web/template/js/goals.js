 

$(document).ready(function(){



 


		/* GOALS  */
	 
	 
		$('[data-toggle="trumbowyg"]').trumbowyg(  );
	 
		
		console.log( $('[data-toggle="rangeslider"]').rangeslider('update', true) );
 
  



		//Взять квест
		$(document).on('click', '.js-add-goal', function(){
			var p = $(this).parents('.addgoal-form'),
				name = p.find('input[name="name"]'),
				description = p.find('textarea[name="description"]'),
				difficulty = p.find('input[name="difficulty"]'),
				deadline = p.find('[name="deadline"]'),
				tags = p.find('.addach-tags-w .addach-tags-tag'),
				tagWords = [],
				_csrf = p.find('input[name=_csrf]'),
				data = {}
				;

				tags.each(function(i,e){
					tagWords[ tagWords.length ] = $(e).text();
				});

				data['name'] = name.val();
				data['description'] = description.val();
				data['difficulty'] = difficulty.val();
				data['deadline'] = deadline.val();
				data['interests'] =  tagWords;
				data['_csrf'] = _csrf.val();
				 
		 	
				$.ajax({
					url: ajaxUrls['addGoal'],
					data: data,
					dataType: 'json',
					type: 'post',
					success: function(data){
						console.log(data);

						if( data.success ){
							$('.addach').slideUp();
							$('.addach-success').slideDown();
						}

						EventEngine.registerEventFromRawAjax (data);
					}

				});

				return false;
 
			
		});



		/* GOALS END */

 


});