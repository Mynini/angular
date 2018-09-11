app.controller("myCtrl",function($scope,$state,$ionicHistory,$interval,$ionicPopup,$ionicModal,$location,$ionicSlideBoxDelegate){
			
			
		//返回
        $scope.goPersonal = function (a){
              $state.go(a);
        }

        
         $scope.myGoBack = function() {
//	       $backView = $ionicHistory.backView();
//	       $backView.go();
	       window.history.back(); 
        };
            

            
        // 验证码倒计时
	    $scope.canClick=false;  
	    $scope.description = "获取验证码";  
	    var second=59;  
	    var timerHandler;  
	    $scope.getTestCode = function(){  
	    	if(second==59 && $scope.canClick==false){
	    		$scope.canClick=true;  
		        timerHandler =$interval(function(){  
		            if(second<=0){  
		                $interval.cancel(timerHandler);    //当执行的时间59s,结束时，取消定时器 ，cancle方法取消   
		                second=59;  
		                $scope.description="获取验证码";  
		                $scope.canClick=false;    //因为 ng-disabled属于布尔值，设置按钮可以点击，可点击发送  
		               
		            }else{  
		                $scope.description=second+"s后重发";  
		                second--;  
		                
		            }  
		        },1000)   //每一秒执行一次$interval定时器方法  
	        }
	    };  

           
        //修改密码2 因为不在后台定义的ng-model ion-content外取不到 故定义了这两个变量
            $scope.user={
               repassword:"",
               password:""
            };
            
        //常用信息-增加发票
        $scope.data={};
        $scope.data.choice_invoice=['个人','公司'];
        
        
        
       // 会员首页电话咨询弹窗
	   $scope.showConfirm=function(){
            var myPopup =$ionicPopup.show({
            	title:"电话咨询",
            	template:"<p class='consult_2_txt'>是否立即拨打国旅咨询预热线4006008888?</p>",
            	cssClass:"consult_2",
            	scope: $scope,
            	buttons:[
            	{text:"取消"},
            	{
            		text:"确认"

            	}]
            })
          }
     
     //会员首页在线咨询弹窗
      $ionicModal.fromTemplateUrl('consult_model.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	 });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  
    // 日期修改
      var now = new Date(),
        max = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
        $scope.settings = {
            theme: 'ios',
            display: 'bottom',
            max: max,
            cssClass:"",
            cancelText:"取消",
            setText:"确定",
            wheelOrder: 'iiss'
           
      };
      
      
      //设置
       $scope.sy_carousel="";
        $scope.slideChange = function () {
        //alert($index);
//        console.log("nextSlide index = ", $index);
          console.log($ionicSlideBoxDelegate);
          console.log($ionicSlideBoxDelegate.currentIndex());
          console.log($ionicSlideBoxDelegate.count());
          
          var s1=$ionicSlideBoxDelegate.currentIndex();
          var s2=$ionicSlideBoxDelegate.count();
          
          if(s1+1==s2){
          	$scope.sy_carousel="sy_active";

          }else{
          	$scope.sy_carousel="";

          }
      };

  	
	

      


            
 });