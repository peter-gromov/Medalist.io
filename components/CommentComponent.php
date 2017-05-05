<?php 
namespace app\components;
 
 
use Yii;
use yii\base\Component;
use yii\base\InvalidConfigException;
use app\models\Comment;
 
class CommentComponent extends Component
{
 


    
    public function renderCommentCount( $num, $commentWrapperClass = false  )
    {

     
        ?>
            <div class="comment-controll js-get-comments" <?php if(!empty($commentWrapperClass) ) {  ?> data-class="<?=$commentWrapperClass?>" <? }?>><span></span><?=$num?></div>
        <?
    }


    public function renderComment($comment, $obj = false , $parent = true){

        if( $parent ){

            
        ?>
            <div class="comment-block comment-id-<?=$comment->comment_id?>">
                <div class="comment-block-data">
                    <div class="comment-block-data-user">
                        <div class="comment-block-data-user-pic"><img src="/template/img/_user-ava.png"></div>
                        <div class="comment-block-data-user-name"> <a class="comment-block-data-user-name-link">Иван Петров</a></div>
                        
                    </div>
                    <div class="comment-block-data-content">
                        <div class="comment-block-data-content-date">27.11.2010</div>
                        <div class="comment-block-data-content-content"><?=$comment->text?></div>
                        <div class="comment-block-controlls">
                            <sudo class="comment-block-controlls-response js-comment-makeresponse" data-id="<?=$comment->comment_id?>">Ответить</sudo>
                        </div>


                    </div>

    


                </div>
                <div class="comment-block-answers">
                    <?php 
                    if( $obj !== false ){


                        $comments = Comment::getCommentsOfObject( $obj, $comment->comment_id )->offset(0)->limit(  2 )->all();

                        
                        foreach( $comments as $c){
                            self::renderComment( $c, $obj, false );
                        }
                    }
                    ?>
                </div>

                
            </div>
        <?   
        }else{

             ?>
            <div class="comment-block  comment-block-sub comment-id-<?=$comment->comment_id?>" data-parent_comment_id="<?=$comment->parent_comment_id?>">
                <div class="comment-block-data">
                    <div class="comment-block-data-user">
                        <div class="comment-block-data-user-pic"><img src="/template/img/_user-ava.png"></div>
                        <div class="comment-block-data-user-name"> <a class="comment-block-data-user-name-link">Иван Петров</a></div>
                        
                    </div>
                    <div class="comment-block-data-content">
                        <div class="comment-block-data-content-date">27.11.2010</div>
                        <div class="comment-block-data-content-content"><?=$comment->text?></div>
                       


                    </div>
                </div>  
            </div>
            <? 

        }
    }

    public function renderCommentFeed(  $obj, $from = 0, $limit = 10 )
    {
        $comments = Comment::getCommentsOfObject( $obj, 0 )->offset($from)->limit( $limit )->all();

       
        foreach( $comments as $com ){
            self::renderComment( $com, $obj );
        }
     
         
    }


    public function renderResponseForm( $obj ){
        $classname = get_class( $obj );
        $classname = explode("\\",$classname);
        $classname = $classname[count($classname) - 1];
        $idVarName = strtolower($classname."_id");
        $id = $obj->{$idVarName};

        if( Yii::$app->user->isGuest ){
            ?>
            <p>Зарегистрируйтесь в Медалисте, чтобы комментировать достижения и цели.</p>
            <?
        }else{
            ?>
            <form class="form-add-comment" data-obj="<?=$classname?>" data-id="<?=$id?>">
                <textarea class="form-add-comment-textarea" ></textarea>
                <input type="hidden" name="parent_comment_id" class="parent_comment_id parent_comment_id-<?=$classname?>-<?=$id?>" value="0">
                <div class="form-add-comment-error" style="display: none;">Введите комментарий</div>
                <div class="form-add-comment-button-wrapper">
                <button class="mdlst-button mdlst-button-default form-add-comment-button js-add-comment ">Оставить комментарий</button>
                </div>
            </form>
            <?
        }
    }
 
}