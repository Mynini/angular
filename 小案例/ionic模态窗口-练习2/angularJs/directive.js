
//app.directive("headNav",function(){
//	return{
//		transclude: true,
//		template:"<li>"+
//		            "<a href=''>你</a>"+
//		         "</li>"
//		         
//	};
//	
//	return {
//      template : "<h1>自定义指令!</h1>"
//  };
//});

app.directive("runoobDirective", function() {
    return {
        template : "<h1>自定义指令!</h1>"
    };
});