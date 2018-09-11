var routerApp = angular.module('routerApp',['ui.router']);
routerApp.config(function($stateProvider, $uilRouterProvider){
   $urlRouterProvider.otherwise('/home') ;

$stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'partial-home.html'
    })

    // home.list符合惯例
    .state('home.list', {
        url: '/list',
        templateUrl: 'partial-home-list.html',
        controller: function($scope) {
            $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        }
    })

    // home.paragraph符合惯例
    .state('home.paragraph', {
        url: '/paragraph',
        template: 'I could sure use a drink right now.'
    })
    .state('about', {
            url: '/about',
            views: { //是指ng-view

                // 模板
                '': { templateUrl: 'partial-about.html' },

                // 名称为columnOne的ng-view,viewName@stateName
                'columnOne@about': { template: 'Look I am a column!' },

                // 名称为columnTow的ng-view,viewName@stateName
                'columnTwo@about': { 
                    templateUrl: 'table-data.html',
                    controller: 'SecondController'
                }
            }

        });
        
    routerApp.controller('SecondController', function($scope) {

        $scope.message = 'test';

        $scope.products = [
            {
                name: 'Macallan 12',
                price: 50
            },
            {
                name: 'Chivas Regal Royal Salute',
                price: 10000
            },
            {
                name: 'Glenfiddich 1937',
                price: 20000
            }
        ];

    });
    
    app.controller("homeCtrl",function($scope,$state){
        $scope.goour = function (){
            $state.go("ourstate",{id:"home-our"});
        };
        $scope.gohome1 = function(){
            $state.go("homestate.home1",{id:"home-home1"});
        };
        $scope.gohome2 = function(){
            $state.go("homestate.home2",{id:"home-home2"});
        }
    });
});