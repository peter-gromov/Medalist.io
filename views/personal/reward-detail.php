<?php
/* @var $this yii\web\View */

echo $this->render('_panel.php');
?>

		<!-- CONTENT -->
		<div class="container">
			<div class="wc">
				<div class="container-cols">
					<?=$this->render("_menu.php")?>


					<!-- container-content -->
					<div class="container-col container-col-2">
						<div class="output">
							<div class="output-header">
								<h2 class="mdlst-h2t">Награда <?=$badge->name?></h2>
								<div class="output-header-meta">

									 

								</div>

							</div> 

							<div class="output-content">
								<div style="background-color: white; margin-top: 10px; margin-bottom: 10px; padding: 25px; box-sizing:  border-box; text-align: center;	">
									<img src="<?=$badge->picture?>">
									<p><?=$badge->description?></p>
									<br>
									<br>
									<p><b>
										<?php
										$scale = $badge->getBadgeScalePoints();
										echo "+".$scale['points']." ".$scale['scale']->name;
										 ?></b>
									</p>
								</div>

								 
								<div class="mdlst-hr mdlst-hr-w"></div>
									<p>Все награды делятся на категории, однако, есть и универсальные, не принадлежащие ни к одной категории. Сортируются награды в зависимости от своей редкости. Путешествия разделены по странам. Промо награды – награды, которые учреждают наши партнеры.</p>
									<p>Cуществует 50 секретных наград. Находите их в профилях других участников и добавляйте в свою коллекцию секретных наград.</p>
								 
							</div>

						</div>

					</div>


				</div>
			</div>
		</div>
		<!-- . CONTENT END -->