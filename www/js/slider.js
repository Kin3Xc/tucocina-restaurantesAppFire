angular.module('tucocinaApp.slider', [])
	.controller('mainSlider',function($scope,$state){

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



	});