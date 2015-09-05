var app = angular.module('tucocinaApp.controllers', ['LocalStorageModule']);





app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});



// CONTROLADORES DE LA APP

// controlador para la vista home, encargada de recoger el código del restaurante
app.controller('HomeCtrl', function($scope, localStorageService, $location) {
  //$scope.pin = 0;
  // almaceno el código del restaurante en el local storage
  $scope.saveCodigoRestaurante = function(){

    var codigo = parseInt($scope.pin);
    console.log(codigo);

    if (codigo != 0) {
      localStorageService.set('codigoRestaurante', codigo);
      $location.url('/app/mesa');
    }else{
      $scope.respuesta_codigo = 'Ingrese el código del restaurante';
    }
  }; // fin saveCodigoRestaurante
  
});// fin HomeCtrl


// controlador para capturar el numero de la mesa y alamcenarlo en el local storage para su posterior uso
app.controller('MesaCtrl', function($scope, localStorageService, $location){

  //$scope.mesa = 0;
  // función para almacenar el numero de la mesa en el local storage
  $scope.mesaRestaurante = function(){

    var numMesa = parseInt($scope.mesa);
    console.log(numMesa);

    if (numMesa != 0) {
      localStorageService.set('numMesa', numMesa);
      //nos vamos al estado menuPrincipal 
      $location.url('/app/menuPrincipal');
    }else{
      $scope.respuesta_mesa = 'Ingrese el numero de su mesa';
    }
  };// fin mesaRestaurante
  

});// fin MesaCtrl




// controlar para cargar las categorias del menu
app.controller('CategoriasCtrl', function($scope, localStorageService, Menu_categorias){

  // cargo todas las categorias al $scope para poder mostrarlas en la vista
  $scope.categorias = Menu_categorias;

  // función para guardar el id de la categoria seleccionada
  $scope.categoria_seleccionada = function(idCategoria){
    if (idCategoria != null) {
      localStorageService.set('idCategoria', idCategoria);
    }
  };// fin categoria_seleccionada

});// fin CategoriasCtrl



app.controller('MenuPrincipalCtrl', function($scope, $location, Menu_categorias){
  $scope.verMenu = function(){
    $location.url('/app/menuCategorias');
    console.log(Menu_categorias);
  }
});

app.controller('MenuCategoriasCtrl', function($scope, $location, Menu_categorias, localStorageService){
  $scope.categorias = Menu_categorias;

  $scope.verPlatos = function(idCategoria){
    console.log('Id Categoria: ' + idCategoria);

    localStorageService.set('idCategoria', idCategoria);
    $location.url('/app/platos');
  };

});



app.controller('PlatosCtrl', function($scope, $location, localStorageService){
  var id = localStorageService.get('idCategoria');

  var count = 0;
  var listPlatos = [];

  var platos = new Firebase("https://tucocina.firebaseio.com/platos/");
  platos.orderByChild("idCategoria").equalTo(id).on("child_added", function(plato) {
    count++;
    listPlatos[count] = plato.val();
    listPlatos[count].$id = plato.key();
    $scope.platos = listPlatos.filter(Boolean);
    console.log('Listado de platos');
    console.log($scope.platos);
  });


  //funcion para mostrara la visata y la info del plato seleccionado por el usuario
  $scope.pedirPlato = function(idPlato){
    console.log('ID Plato Seleccionado: '+ idPlato);
    localStorageService.set('idPlato', idPlato);

    $location.url('/app/platoSeleccionado');
  };
});


app.controller('platoSeleccionadoCtrl', function($scope, $location, localStorageService, Pedidos){
  var id = localStorageService.get('idPlato');

  var plato = new Firebase("https://tucocina.firebaseio.com/platos/"+id).once('value', function(data){
    $scope.platoSelect = data.val();
    console.log('Plato: '+$scope.platoSelect);
  });

  //ingredientes
  var count = 0;
  var ingredientes = [];

  var ingre = new Firebase("https://tucocina.firebaseio.com/ingredientes/");
  ingre.orderByChild("idPlato").equalTo(id).on("child_added", function(ingrediente) {
    count++;
    ingredientes[count] = ingrediente.val();
    ingredientes[count].$id = ingrediente.key();
    $scope.ingredientesPlato = ingredientes.filter(Boolean);
    console.log('Listado de ingredientes');
    console.log($scope.ingredientesPlato);
  });

  // adicionales
  var count = 0;
  var adicionales = [];

  var adi = new Firebase("https://tucocina.firebaseio.com/adicionales/");
  adi.orderByChild("idPlato").equalTo(id).on("child_added", function(adicional) {
    count++;
    adicionales[count] = adicional.val();
    adicionales[count].$id = adicional.key();
    $scope.adicionalesPlato = adicionales.filter(Boolean);
    console.log('Listado de adicionales');
    console.log($scope.adicionalesPlato);
  });



  //regresa los pedidos de una sola mesa
  var count = 0;
  var mesaActual = [];

  var numMesa = localStorageService.get('numMesa');
  var miMesa = new Firebase("https://tucocina.firebaseio.com/pedidos/");
  miMesa.orderByChild("mesa").equalTo(numMesa).on("child_added", function(mesa) {
    count++;
    mesaActual[count] = mesa.val();
    console.log(mesaActual);
    // mesaActual[count].$id = mesa.key();
    $scope.pedidosMesa = mesaActual.filter(Boolean);
    console.log('Listado de platos de la mesa');
    console.log($scope.pedidosMesa);
  });



  // función para enviar el pedido, despúes de esto el pedido llegará al mesero
  // luego de confirmar el envío se le redireccionará al resumen desde donde podrá realizar 
  // un nuevo pedido que quedará asignado a la mesa actual
  $scope.enviarPedido = function(){
    var mesa = localStorageService.get('numMesa');

    var pedido = {
      mesa: mesa,
      plato: $scope.platoSelect.nombrePlato,
      precio: $scope.platoSelect.valor,
      estado: 'en proceso',
      ingredientes: [$scope.ingredientesPlato],
      adicionales: [$scope.adicionalesPlato]
    };

    Pedidos.$add(pedido);

    $location.url('app/resumen');

  };


  // función para realizar un nuevo pedido en la mesa actual
  $scope.otroPedido = function(){
    $location.url('/app/menuCategorias');
  };


});