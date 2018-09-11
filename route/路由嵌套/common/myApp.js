var app = angular.module("myApp",["ui.router"]);
        
    app.controller("myCtrl",function($scope,$state,$stateParams){

        //goTo跳转
        $scope.goTo = function(a,data){
              $state.go(a,{id:data});
        }

         $scope.myGoBack = function() {
//	       $backView = $ionicHistory.backView();
//	       $backView.go();
//	       window.history.back(); 
        };
      
      
      $scope.printId=function(){
      	console.log($stateParams.id+"&nbsp;why 这个参数在里面在98号的controller里面就能取到")
      }
            
    });
    

        
    app.config(function($stateProvider, $urlRouterProvider){
        $stateProvider
        .state("home",{
        	url:"/home",
        	templateUrl:"home.html"
        })
        .state("home.child1",{
        	url:"/home-child1",
        	templateUrl:"home-child1.html"
        })
        .state('page1', {
            url: "/page1",//控制地址栏跳转的地址
            views:{
                //"","v1","v2"是ui-view的名字
                "":{
                    templateUrl: 'page1.html'
                },
                "v1":{
                    template:"<p>在v1视图显示的附加page1页面</p>"
                }
            }
        })
        .state("page1.child1",{
            url:"/page1-child1/?h1?id",//写在这里的传参可以在url上看到 ,但是控制台打不出来
            //params:{h1:null,id:null},//写法同上; //写在这里的传参在url上看不到 可以在后控制台打印出来;
            views:{
                "":{
                    controller:function($scope,$stateParams){
                        console.log($stateParams.h1);//ui-sref传参
                        console.log($stateParams.id);//state.go传参
                    },
                    templateUrl: 'page1-child1.html'
                },
                "page1-v2":{
                    template:"<p>在page1-v2视图显示的附加page1-child1页面</p>"
                }
            //由于page1-child1是page1的子页面,所以v1和v2页面设置是无效的,因为v1和v2不在page1页面里而是在index页面
            }
        })
        .state("page1.child2",{
            url:"/page1-child2",
            views:{
                "":{
                    controller:function($scope){
//                            console.log($stateParams.h1);
                    },
                    templateUrl: 'page1-child2.html'
                },
            }
        })
        .state("page2",{
            url:"/page2",
            params:{data:null},
            views:{
                "":{
                    controller:function($scope,$stateParams){
                        console.log($stateParams.data);
                    },
                    templateUrl: 'page2.html'
                },
                "v2":{
                    template:"<p>在v2显示的附加page2页面</p>"
                }
            }
        })
        .state("page3",{
            url:"/page3/?id", //url会显示id=page3 
            params:{"id":"page3"},//或者url:"/our:id"
            views:{
                "":{
                	
//                  controller:"myCtrl",
                    controller:function($scope,$stateParams){
                        console.log($stateParams.id);
                    },
                    templateUrl: 'page3.html'
                },
                "v2":{
                    template:"<p>在v2显示的附加page3页面</p>"
                }
            }
        })
        $urlRouterProvider.otherwise('/home');
    });
    
   
    
    