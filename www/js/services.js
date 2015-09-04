var app = angular.module('tucocinaApp.services', ['LocalStorageModule']);


// creo un array con las categorias de la base de datos
app.factory("Menu_categorias", function($firebaseArray) {
	var categorias = new Firebase("https://tucocina.firebaseio.com/categorias");
	return $firebaseArray(categorias);
});

// traigo cadao uno de los platos de la base de datos
app.factory("Platos", function($firebaseArray) {
	var platos = new Firebase("https://tucocina.firebaseio.com/platos");
	return $firebaseArray(platos);
});

// traigo un plato por si ID
app.factory("PlatosIdCategoria", function($firebaseArray, localStorageService) {
	var idPlatoCategoria = localStorageService.get('idCategoria');
	// valido que exista un plato seleccionado
	if (idPlatoCategoria != null) {
		var platosCategoria = new Firebase("https://tucocina.firebaseio.com/platos/");
		var list = $firebaseArray(platosCategoria);
		var platosCategoria = list.$getRecord('idPlatoCategoria');
		return platosCategoria;
	}else{
		return $firebaseArray({platosCategoria: 'null'});
	}
});

var list = $firebaseArray(ref);
var rec = list.$getRecord("foo"); // record with $id === "foo" or null
