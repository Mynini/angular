var app = angular.module('cits', ['ionic']);

app.controller('citsCtrl', function($scope, $timeout, $ionicModal,  $ionicSideMenuDelegate) {
	
	$scope.nav = [
		{name:"首页",url:"home"},
		{name:"课程",url:"kechang"},
		{name:"公开课",url:"gongkaike"},
		{name:"实习",url:"shixi"}
	]
	
	
	$scope.toggleProjects = function() {
			$ionicSideMenuDelegate.toggleLeft();	//切换左侧导航状态
		  };

$scope.selectProject = function(project, index) {	//根据传入对象及索引，更显当前项
		//window.location = project.url
		$ionicSideMenuDelegate.toggleLeft(false);	//关闭侧边栏
	  };

});

	
      app.constant("conNav",[
 					   {name:"首页",url:"/tab/home",templateUrl:"index_1.html"},
					   {name:"关于我们",url:"/tab/about",templateUrl:"abgout.html"},
					]);
					
					
					
	  app.directive("headNav", function() {
		   return{
				transclude: true,
				scope:false,
				controller:["$scope","conNav",function($scope,conNav){
					$scope.navArr=conNav;
				}],
				template:"<li ng-repeat='x in navArr'>"+
				            "<a href='#{{x.url}}' >{{x.name}}</a>"+
				         "</li>"
				         
		  };
      });

       app.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $sceDelegateProvider) {

			$stateProvider
			.state('home', {
				url: '/tab/home',
				//cache: false,
				templateUrl: '产品-列表页.html',
				//controller: 'TodoCtrl'

			})
			.state('kechang', {
				url: '/tab/kechang',
				//cache: false,
				templateUrl: '产品-测试.html',
				//controller: 'TodoCtrl'

			})
			 $urlRouterProvider.otherwise("/tab/home");
			/*
        .state('tabs', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
        })
			
        .state('tabs.home', {
          url: "/home",
          views: {
            'home-tab': {
              templateUrl: "templates/home.html",
              controller: 'HomeTabCtrl'
            }
          }
        })
		
        .state('tabs.facts', {
          url: "/facts",
          views: {
            'home-tab': {
              templateUrl: "templates/facts.html"
            }
          }
        })
        .state('tabs.facts2', {
          url: "/facts2",
          views: {
            'home-tab': {
              templateUrl: "templates/facts2.html"
            }
          }
        })
        .state('tabs.about', {
          url: "/about",
          views: {
            'about-tab': {
              templateUrl: "templates/about.html"
            }
          }
        })
        .state('tabs.navstack', {
          url: "/navstack",
          views: {
            'about-tab': {
              templateUrl: "templates/nav-stack.html"
            }
          }
        })
        .state('tabs.contact', {
          url: "/contact",
          views: {
            'contact-tab': {
              templateUrl: "templates/contact.html"
            }
          }
        });
*/


		  }])
		
		





