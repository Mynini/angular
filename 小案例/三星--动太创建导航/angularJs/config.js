var app=angular.module("myApp", ["ngRoute"]);
   

	  app.directive("headNav", function() {
		   return{
				transclude: true,
				scope:false,
				controller:["$scope",function($scope){
					$scope.navArr=[
					   {name:"首页",url:"#/",},
					   {name:"关于我们",url:"#/1.html"},
					   {name:"新闻",url:"#/2.html"}
					];
				}],
				template:"<li ng-repeat='x in navArr'>"+
				            "<a href=\'{{x.url}}\' >{{x.name}}</a>"+
				         "</li>"
				         
		  };
      });
      app.config("$routeProvider",function($routeProvider,$scope){
			for(var i=0;i<$scope.navArr.length;i++){
				 $routeProvider
                .when($scope.navArr.name,{templateUrl:$scope.navArr.url})
			}
			
		})