<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\Achievement;
use app\models\Photo;
use app\models\LoginForm;
use app\models\ContactForm;
use app\models\Quest;
use app\models\Category;
use app\models\User;
use app\models\Tag;
use app\models\ScalePointsBalance;

class SiteController extends Controller
{
    var $layout = 'medalist_inner';
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {

        if( !Yii::$app->user->isGuest ) {
            $this->redirect(['personal/viewprofile', 'user_id' => Yii::$app->user->identity->id]);
        }
        $tag = Tag::findOne(6);

        $interests = $tag->getInterests();
        $int = array();
        foreach ($interests as $interest) {
            $int[] = $interest->interest_id;
        }
    
      
        return $this->render('index', ['interests' => '', 'interests2' => '']);
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionLastAchievements()
    {
        //$achievements = Achievement::find()->limit(5)->all();
        //Берем 100 фоток, сортируем по дате
        $photos = Photo::find()->where("entity_class = 'Achievement'")->select('entity_id, date_created')->orderBy(['date_created' => SORT_DESC])->distinct()->limit(100)->all();
        $entity_ids = [];
        foreach ($photos as $key => $photo) {
            //Оставляем только один энтити айди (если много фооток, чо)
           $entity_ids[$photo->entity_id] = $photo->entity_id;

        }
       

        $achievements = Achievement::find()->where(['achievement_id' => $entity_ids])->orderBy(['date_achieved' => SORT_DESC])->limit(30)->all();
       
      
        return $this->render('last-achievements', ['achievements' =>  $achievements]);
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionAjaxUploadImage()
    { 

        $this->enableCsrfValidation = false;

        $ds = DIRECTORY_SEPARATOR;  //1
     
        $storeFolder = './uploads/ajax_upload/';   //2
         
        if (!empty($_FILES)) {
             
            $tempFile = $_FILES['file']['tmp_name'];          //3             


		    list($original_width, $original_height, $original_type) = getimagesize($tempFile);


		    if ($original_type === 1) {
	    	    $imgcreatefrom = "ImageCreateFromGIF";
		    } else if ($original_type === 2) {
		        $imgcreatefrom = "ImageCreateFromJPEG";
		    } else if ($original_type === 3) {
		        $imgcreatefrom = "ImageCreateFromPNG";
		    } else {
		   	    return false;
		    }

    		$image = $imgcreatefrom($tempFile);

	    	if ($original_type === 2) {
				$exif = exif_read_data($tempFile);
				if(!empty($exif['Orientation'])) {
				    switch($exif['Orientation']) {
			        case 8:
			            $image = imagerotate($image,90,0);
		        	    break;
	    		    case 3:
			            $image = imagerotate($image,180,0);
	        		    break;
			        case 6:
	        		    $image = imagerotate($image,-90,0);
			            break;
			    	}
			    }
			}

       	    ImageJPEG($image, $tempFile);
              
            $targetPath = $storeFolder;  //4
            $info = pathinfo( $_FILES['file']['name'] );
            $newFilename = date("YmdHis").md5(time().rand(0,10000)).".jpg";
             
            $targetFile =  $targetPath. $newFilename ;  //5

            echo $targetPath. $newFilename ;
         
            move_uploaded_file($tempFile,$targetFile); //6

        }
       
    }

    public function actionAjaxShareTrack(){
        $result = [];

        $get = Yii::$app->request->get();
        $result['success'] = false;
        if( !empty($get['user_id']) && !empty($get['entity_class']) && !empty($get['entity_id'])){
            ScalePointsBalance::addBalance($get['user_id'], ScalePointsBalance::BASE_SHARE_SCALE, ScalePointsBalance::BASE_SHARE_POINTS, $get['entity_class'], $get['entity_id']);    
            $result['success'] = true;
        }
        

        return json_encode($result);
    }

    /**
     * Login action.
     *
     * @return string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return string
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    /**
     * Displays howitworks page.
     *
     * @return string
     */
    public function actionHowitworks()
    {
        return $this->render('howitworks');
    }

    /**
     * Displays howitworks page.
     *
     * @return string
     */
    public function actionSuccessstories()
    {
        return $this->render('successstories');
    }


}
