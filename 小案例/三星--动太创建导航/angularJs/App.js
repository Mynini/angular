
var app=angular.module("myApp", ["ngRoute"]);

      app.constant("conNav",[
 					   {name:"首页",url:"/",templateUrl:"index_1.html"},
					   {name:"关于我们",url:"/1",templateUrl:"about.html"},
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
      
      app.config(["$routeProvider","conNav",function($routeProvider,conNav){
			for(var i=0;i<conNav.length;i++){
				$routeProvider
                .when(conNav[i].url,{templateUrl:conNav[i].templateUrl})
			}
			
			
		}])





