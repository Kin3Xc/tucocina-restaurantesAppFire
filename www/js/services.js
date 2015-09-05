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

// gestionar pedidos
app.factory("Pedidos", function($firebaseArray) {
	var pedidos = new Firebase("https://tucocina.firebaseio.com/pedidos");
	return $firebaseArray(pedidos);
});



