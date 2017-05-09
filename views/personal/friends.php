<?php
/* @var $this yii\web\View */
use app\models\Goal;

echo $this->render('_panel.php');
?>
<link rel="stylesheet" href="/template/css/goals.css">
<!-- CONTENT -->
<div class="container">
    <div class="wc">
        <div class="container-cols">
            <?= $this->render("_menu.php") ?>
            <!-- container-content -->
            <div class="container-col container-col-2">
                <!-- Списко целей-->
                <div class="output">
                    
                   <div class="output-header">
                        <div class="mygoals-name-div">
                            <h2 class="mdlst-h2t-goals withButton">Вы подписаны</h2>
                      
                            <div class="clear"></div>
                        </div>
                    </div>



                   <div class="output-header">
                        <div class="mygoals-name-div">
                            <h2 class="mdlst-h2t-goals withButton">Вы можете их знать</h2>
                      
                            <div class="clear"></div>
                        </div>
                    </div>

                    <div class="possible-friends">
                    <?php foreach ($possibleFriends as $user) {
                        $profile = $user->getProfile()->one();
                        $avatarSrc= $profile->getAvatarSrc();
                        ?>

                        <div class="possible-friends-block">
                            <div class="possible-friends-block-pic"><img src="<?=$avatarSrc?>"></div>
                            <div class="possible-friends-block-name">
                                <a href="<?=Yii::$app->urlManager->createUrl('profile/view', ['user_id' => $user->id])?>" class="possible-friends-block-name-url"><?=$user->email?></a>
                            </div>
                            <div class="possible-friends-block-follow js-follow-person mdlst-button mdlst-button-default" data-user_id="<?=$user->id?>">Подписаться</div>
                        </div>
                       
                        

                        <?
                    } ?>
                    </div>

                    
                </div>
                <!--output-->
                <!-- Списко целей-->
            </div>
        </div>
    </div>
</div>

<!-- . CONTENT END -->