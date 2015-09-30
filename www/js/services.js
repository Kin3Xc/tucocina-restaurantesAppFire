var app = angular.module('tucocinaApp.services', ['LocalStorageModule']);


// creo un array con las categorias de la base de datos
app.factory("Menu_categorias", function($firebaseArray, $q, $timeout, localStorageService) {


	var getCategorias = function(){
		var deferred = $q.defer();

		$timeout(function(){
			var id = localStorageService.get('codigoRestaurante');
			var mandaPlatoId = null;
		    var count = 0;
		    var listPlatos = [];

			var categorias = new Firebase("https://tucocina.firebaseio.com/categorias");
			categorias.orderByChild("id_restaurante").equalTo(id).on("child_added", function(plato) {
				count++;
	            listPlatos[count] = plato.val();
	            listPlatos[count].$id = plato.key();

	            mandaPlatoId = listPlatos.filter(Boolean);
		        
		        console.log('Listado de platos');
			});
			// var mandaCategorias = $firebaseArray(categorias);
			deferred.resolve(mandaPlatoId);

		}, 2000);
		return deferred.promise;
	};

	return{
		getCategorias: getCategorias
	}


	// var categorias = new Firebase("https://tucocina.firebaseio.com/categorias");
	// return $firebaseArray(categorias);
	
	
});

// traigo cadao uno de los platos de la base de datos
app.factory("Platos", function($firebaseArray, $q, $timeout) {


	var getPlatos = function(){
		var deferred = $q.defer();

		$timeout(function(){
			var platos = new Firebase("https://tucocina.firebaseio.com/platos");
			var mandaPlatos = $firebaseArray(platos);

			deferred.resolve(mandaPlatos);
		}, 1500);
		return deferred.promise;
	};
	return {
		getPlatos: getPlatos
	}



	// var platos = new Firebase("https://tucocina.firebaseio.com/platos");
	// return $firebaseArray(platos);
});

// gestionar pedidos
app.factory("Pedidos", function($firebaseArray) {
	var pedidos = new Firebase("https://tucocina.firebaseio.com/pedidos");
	return $firebaseArray(pedidos);
});




app.factory("PlatoId", function($firebaseArray, $q, $timeout, localStorageService){
	var getPlatoId = function(){
		var deferred = $q.defer();

		$timeout(function(){

			var id = localStorageService.get('idCategoria'); // accedo al id de la categoría seleccionada por el usuario
		    
		    var mandaPlatoId = null;
			console.log(id);
		    var count = 0;
		    var listPlatos = []; // array para ir almacenando los platos de una categoría
		    var platos = new Firebase("https://tucocina.firebaseio.com/platos");
		    platos.orderByChild("idCategoria").equalTo(id).on("child_added", function(plato) {
		        count++;
	            listPlatos[count] = plato.val();
	            listPlatos[count].$id = plato.key();

	            mandaPlatoId = listPlatos.filter(Boolean);
		        
		        console.log('Listado de platos');
		      
		    });

		    // manda el id del plato
		    deferred.resolve(mandaPlatoId);
		}, 1500);
		return deferred.promise;
	};
	return {
		getPlatoId: getPlatoId
	}
});

