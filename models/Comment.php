<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "comment".
 *
 * @property integer $comment_id
 * @property integer $active
 * @property integer $deleted
 * @property integer $created_by_id
 * @property string $text
 * @property string $entity_class
 * @property integer $entity_id
 * @property integer $parent_comment_id
 */
class Comment extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'comment';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['active', 'deleted', 'created_by_id', 'entity_id', 'parent_comment_id'], 'integer'],
            [['created_by_id', 'text', 'entity_class', 'entity_id', 'date_created'], 'required'],
            [['text'], 'string'],
            [['entity_class'], 'string', 'max' => 256],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'comment_id' => 'Comment ID',
            'active' => 'Active',
            'date_created' => 'Date Created',
            'deleted' => 'Deleted',
            'created_by_id' => 'Created By ID',
            'text' => 'Text',
            'entity_class' => 'Entity Class',
            'entity_id' => 'Entity ID',
            'parent_comment_id' => 'Parent Comment ID',
        ];
    }

    /**
     * @inheritdoc
     * @return CommentQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new CommentQuery(get_called_class());
    }


    public function getObject(){
        $class = "app\\models\\".$this->entity_class;
        return $class::findOne($this->entity_id);
        //Todo User
    }

    public function getObjectUrl(){
        switch ( $this->entity_class ) {
            case 'Achievement':
                return Yii::$app->urlManager->createUrl( ['personal/achievement', 'achievement_id' => $this->entity_id] );
                break;
            case 'Goal':
                return Yii::$app->urlManager->createUrl( ['personal/goal', 'goal_id' => $this->entity_id] );
                break;
            case 'Quest':
                return Yii::$app->urlManager->createUrl( ['personal/quest', 'quest_id' => $this->entity_id] );
                break;
            
            default:
                # code...
                break;
        }
    }



    //GetLikesOfObject
    public static function getCommentsOfObject( $obj, $comment_id = false ){
        $classname = get_class( $obj );
        $classname = explode("\\",$classname);
        $classname = $classname[count($classname) - 1];
        $idVarName = strtolower($classname."_id");
        $id = $obj->{$idVarName};
 

        if( $comment_id ===false ){
            return Comment::find()->where("entity_class = '".$classname."' and entity_id = ".$id) ;            
        }else{
            return Comment::find()->where("entity_class = '".$classname."' and entity_id = ".$id." and parent_comment_id = ".$comment_id) ;
        }


    }





    /**
    * Return -1, 1 as point, or int > 1 as like id, OR false in error
    */
    public static function addCommentToObject( $entity_class, $entity_id, $com, $parent_comment_id = null){
        if( !Yii::$app->user->isGuest ){
            
                $comment = new Comment;
                $comment->entity_class = ucfirst($entity_class);
                $comment->entity_id = $entity_id;
                $comment->created_by_id = Yii::$app->user->identity->id ;
                $comment->text = $com;
                $comment->parent_comment_id = $parent_comment_id;
                $comment->date_created = date("Y-m-d H:i:s");
                $result = $comment->save();
               
               if( $result ){
                return $comment->comment_id;
               }else{
                return false;
               }
           
        }else{
           
            return false;
        }
    }    



    public static function getCommentsByUserId( $entity_class, $entity_id, $user_id){
        return Comment::find()->where("entity_class = '".ucfirst($entity_class)."' and entity_id = ".$entity_id." and created_by_id = ".$user_id)->all();
    }




}
