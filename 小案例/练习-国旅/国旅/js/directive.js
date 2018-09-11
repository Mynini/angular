   app.directive("myname",function(){
		return {
			require: 'ngModel',
			link:function(scope,elm,attrs,ctrl){
				if(elm.val()!=""){
					attrs.$set('readonly', true);
					ctrl.$setValidity("myname",false);
				}else{
					ctrl.$setValidity("myname",true);
				}
			      
			}
			
		}
	})
	
