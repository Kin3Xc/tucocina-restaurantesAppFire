angular.module('tucocinaApp.slider', ['LocalStorageModule'])
	.controller('mainSlider',function($scope,$state, $firebaseArray, localStorageService, $ionicLoading, $timeout){

		$scope.loadingIndicator = $ionicLoading.show({
	      content: 'Loading Data',
	      animation: 'fade-in',
	      showBackdrop: true,
	      maxWidth: 200,
	      showDelay: 500
	    });


		var id_user = localStorageService.get('idUser');

		var img_slider = null;
	    var count = 0;
	    var listSlider = [];

		var img_promos = new Firebase("https://tucocina.firebaseio.com/img_promos");
		// $scope.slides = $firebaseArray(img_promos);
		img_promos.orderByChild("id_user").equalTo(id_user).on("child_added", function(imagen) {
			count++;
            listSlider[count] = imagen.val();
		});

		$timeout(function(){
			$scope.slides = listSlider.filter(Boolean);
			console.log($scope.slides);
			$ionicLoading.hide();
		},2500);

		$scope.slides =[
			{
				title:'Hamburguesas Corral',
				image:'http://infokioscos.com.ar/wp-content/uploads22/knorr-promo.jpg',
				text:''
			},
			{
				title:'Hamburguesas Corral one',
				image:'http://dmaximosabor.com/cloud/ade54b_promo_pollo.jpg',
				text:''
			},
			{
				title:'Hamburguesas Corral two',
				image:'http://amerpages.com/img/items/121/21119/img/26547_l.jpg',
				text:''
			},
			{
				title:'Hamburguesas Corral tree',
				image:'http://clickfood.com.ar/images/Promo_Lomos_Jasper.png',
				text:''
			},			
		];
		 
console.log($scope.slides);

	});