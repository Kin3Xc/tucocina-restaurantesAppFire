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
app.controller('HomeCtrl', function($scope, localStorageService, $location, $ionicHistory, $state, $ionicLoading, $timeout,  $ionicPopup) {
  //$scope.pin = 0;
  // almaceno el código del restaurante en el local storage

   // An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'PIN no válido!',
       template: 'El PIN ingresado no es válido, por favor vuelva a intentarlo.'
     });
     alertPopup.then(function(res) {
        $scope.pin = '';
       console.log('PIN no válido');
     });
   };

  $scope.restauranteSelecionado = null;

  $scope.saveCodigoRestaurante = function(){

  localStorageService.set('sliders', null);

    $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });




    var codigo = parseInt($scope.pin);
    console.log(codigo);

    if (codigo != 0) {
      localStorageService.set('codigoRestaurante', codigo);

      var restSeleccionado = [];

      //verifico qe ese codigo pertenece a algun restaurante
      var restID = new Firebase("https://tucocina.firebaseio.com/restaurantes");
      restID.orderByChild("nit").equalTo(codigo).on("child_added", function(rest) {
        
        restSeleccionado[0] = rest.val();
        restSeleccionado[0].$id = rest.key();

        // mandaPlatoId = listPlatos.filter(Boolean);
      });

    


     // traigo las imagenes de ese restaurantes

      // asigno lo que deja la funcion al scope
      $timeout(function(){
        $scope.restauranteSelecionado = restSeleccionado;
        console.log($scope.restauranteSelecionado);
        if ($scope.restauranteSelecionado[0] == null) {
          console.log('NO EXISTE!');
          $ionicLoading.hide();

          $scope.showAlert();

        }else{

        var listSlider = [];
        var count = 0;
        var img_promos = new Firebase("https://tucocina.firebaseio.com/img_promos");
        // $scope.slides = $firebaseArray(img_promos);
        img_promos.orderByChild("id_user").equalTo( $scope.restauranteSelecionado[0].id_user).on("child_added", function(imagen) {
         count++;
          listSlider[count] = imagen.val();
         var sliders = listSlider.filter(Boolean);

         console.log(sliders);

         localStorageService.set('sliders', sliders);

        });

          localStorageService.set('idUser', $scope.restauranteSelecionado[0].id_user);
          $ionicLoading.hide();
          $state.go('app.mesa');
        }
      }, 2500);

      // $ionicHistory.clearHistory();
      // $ionicHistory.clearCache();
      //$location.url('/app/mesa');
    }else{
      $scope.respuesta_codigo = 'Ingrese el código del restaurante';
    }
  }; // fin saveCodigoRestaurante
  
});// fin HomeCtrl


// controlador para capturar el numero de la mesa y alamcenarlo en el local storage para su posterior uso
app.controller('MesaCtrl', function($scope, localStorageService, $location,$ionicHistory, $state){

  //$scope.mesa = 0;
  // función para almacenar el numero de la mesa en el local storage
  $scope.mesaRestaurante = function(){
    var numMesa = parseInt($scope.mesa);
    console.log(numMesa);

    if (numMesa != 0) {
      localStorageService.set('numMesa', numMesa);
      localStorageService.set('count', 1); // contador
      //nos vamos al estado menuPrincipal 
      // $ionicHistory.clearHistory();
      // $ionicHistory.clearCache();
      $state.go('app.menuPrincipal');

      //$location.url('/app/menuPrincipal');

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


// controlador para gestionar el menu principal de la app
app.controller('MenuPrincipalCtrl', function($scope, $location, Menu_categorias, $ionicHistory, $state, localStorageService){
  
  // sliders 
  $scope.sliders = localStorageService.get('sliders');



  // vamos a menu-categorias.html
  $scope.verMenu = function(){
    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    $state.go('app.menuCategorias');
    //$location.url('/app/menuCategorias');
    console.log(Menu_categorias);
  }

  // vamos a del-dia.html
  $scope.verDelDia = function(){
    $location.url('/app/DelDia');
  }


  // vamos a tu-pedido.html
  $scope.verTuPedido = function(){
    $location.url('/app/tuPedido');
  }


  //vamos a pedir-cuenta.html
  $scope.verPedirCuenta = function(){
    $location.url('/app/pedirCuenta');
  }

  $scope.verLlamarMesero = function(){
    $location.url('/app/llamar-mesero');
  }
});






// controlador para gestionar el menú categorías, desde acá se cargan todas las categorías del restaurante
app.controller('MenuCategoriasCtrl', function($timeout, $scope, $location, Menu_categorias, localStorageService, $ionicHistory, $state, $ionicLoading){

    $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });


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


$timeout(function(){
  $ionicLoading.hide();
  $scope.categorias = mandaPlatoId;
}, 1500);

// Menu_categorias.getCategorias().then(
//   function(categorias){
//     $scope.categorias = categorias;
//     $ionicLoading.hide();
//   }
// )

  
// $ionicLoading.show({
//       content: 'Loading',
//       animation: 'fade-in',
//       showBackdrop: true,
//       maxWidth: 200,
//       showDelay: 0
//     });



// $timeout(function(){
  // $ionicLoading.hide();

  // asigno el array que llega de fb
  // $scope.categorias = Menu_categorias;

// }, 2000);
  


  // función para cargar la vista de platos pertenecientes a una categoría
  $scope.verPlatos = function(idCategoria){
    console.log('Id Categoria: ' + idCategoria);

    localStorageService.set('idCategoria', idCategoria);

    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    $state.go('app.platos');
    //$location.url('/app/platos');
  };

});









// controlador para gestionar los platos de una categoría
app.controller('PlatosCtrl', function($scope, $location, localStorageService, $ionicHistory, $state, $ionicLoading, $timeout, Platos, PlatoId){
    $scope.platos = null; //limpio el $scope de platos

    // var id = localStorageService.get('idCategoria'); // accedo al id de la categoría seleccionada por el usuario
    // $scope.platos = null; //limpio el $scope de platos

    // var count = 0;
    // var listPlatos = []; // array para ir almacenando los platos de una categoría
    // var platos = '';
    // platos = Platos;
    // platos.orderByChild("idCategoria").equalTo(id).on("child_added", function(plato) {
    //         count++;
    //         listPlatos[count] = plato.val();
    //         listPlatos[count].$id = plato.key();

    //          $scope.platos = listPlatos.filter(Boolean);
        
    //       console.log('Listado de platos');
    //       console.log($scope.platos);
        

    //   });

    $scope.loadingIndicator = $ionicLoading.show({
      content: 'Loading Data',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });


    Platos.getPlatos().then(
      function(platos){


         PlatoId.getPlatoId().then(function(platoId){
          $scope.platos = platoId;
          $ionicLoading.hide();
         })  
      });
  
  // // $timeout(function(){
  //   $ionicLoading.hide();

    //  platos.orderByChild("idCategoria").equalTo(id).on("child_added", function(plato) {
    //   count++;
    //   listPlatos[count] = plato.val();
    //   listPlatos[count].$id = plato.key();
    //   $scope.platos = listPlatos.filter(Boolean);
    // });
    // console.log('Listado de platos');
    // console.log($scope.platos);
  
    


    // }, 3000);


  

  //funcion para mostrara la visata y la info del plato seleccionado por el usuario
  $scope.pedirPlato = function(idPlato){
    console.log('ID Plato Seleccionado: '+ idPlato);
    localStorageService.set('idPlato', idPlato);

    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    $state.go('app.platoSeleccionado');


    $location.url('/app/plato-seleccionado');


  };
});









// controlador para gestionar los platos seleccioniados en una mesa
app.controller('platoSeleccionadoCtrl', function($scope, $location, localStorageService, Pedidos, $ionicHistory, $state){

  var id = localStorageService.get('idPlato');

  var plato = new Firebase("https://tucocina.firebaseio.com/platos/"+id).once('value', function(data){
    $scope.platoSelect = data.val();
    console.log($scope.platoSelect);
  });

  //ingredientes de un plato
  var count = 0;
  var ingredientes = [];

  var ingre = new Firebase("https://tucocina.firebaseio.com/ingredientes/");
  ingre.orderByChild("idPlato").equalTo(id).on("child_added", function(ingrediente) {
    count++;
    ingredientes[count] = ingrediente.val();
    ingredientes[count].$id = ingrediente.key();
    $scope.ingredientesPlato = ingredientes.filter(Boolean);

    
    // console.log('Listado de ingredientes');
    // console.log($scope.ingredientesPlato);

  });
   
  // adicionales de un plato
  var count = 0;
  var adicionales = [];

  var adi = new Firebase("https://tucocina.firebaseio.com/adicionales/");
  adi.orderByChild("idPlato").equalTo(id).on("child_added", function(adicional) {
    count++;
    adicionales[count] = adicional.val();
    adicionales[count].$id = adicional.key();
    $scope.adicionalesPlato = adicionales.filter(Boolean);


    // console.log('Listado de adicionales');
    // console.log($scope.adicionalesPlato);

  });


  //regresa los pedidos de una sola mesa
  var count = 0;
  var mesaActual = [];

  var numMesa = localStorageService.get('numMesa');
  var miMesa = new Firebase("https://tucocina.firebaseio.com/pedidos/");
  miMesa.orderByChild("mesa").equalTo(numMesa).on("child_added", function(mesa) {
    count++;
    mesaActual[count] = mesa.val();
    //console.log(mesaActual);
    // mesaActual[count].$id = mesa.key();
    $scope.pedidosMesa = mesaActual.filter(Boolean);

    // console.log('Listado de platos de la mesa');
    // console.log($scope.pedidosMesa);

  });


  //función para ver el resumen del pedido
  $scope.verResumen = function(){

    // creo un objeto con el pedido para almacenarlo en el localstorage
    var count = localStorageService.get('count'); //contador para contar la cantidad de pedidos de la mesa
    var idUser = localStorageService.get('idUser');

    // identifico ingredientes
    var divCont = document.getElementById('contieneCheck');

    var checkIngredientes = divCont.getElementsByTagName('input');
    var IngredientesSeleccionados = [];

    for(var i = 0; i < checkIngredientes.length; i++){

      if(checkIngredientes[i].checked == true){
        console.log('valor de i: '+ i);
      
      
        if(checkIngredientes[i] != null ){
          console.log(ingrediente);
          var ingrediente = checkIngredientes[i].value;
          IngredientesSeleccionados[i] = ingrediente;
        }
      }
    }
    // remueve elementos null o undefined o 0
    IngredientesSeleccionados = IngredientesSeleccionados.filter(function(e){return e});

    console.log(IngredientesSeleccionados);

    // localStorageService.set('ingredientes'+count, IngredientesSeleccionados);


    // identifico adicionales
    divAdicionales = document.getElementById('checkAdicionales');
    var checkAdicionales = divAdicionales.getElementsByTagName('input');
    var adicionalesSeleccionados = [];

    for(var i = 0; i < checkAdicionales.length; i++){

      if(checkAdicionales[i].checked == true){
        console.log('valor de i: '+ i);
      
      
        if(checkAdicionales[i] != null ){
          console.log(ingrediente);
          var adicional = checkAdicionales[i].value;
          adicionalesSeleccionados[i] = adicional;
        }
      }
    }
     // remueve elementos null o undefined o 0
    adicionalesSeleccionados = adicionalesSeleccionados.filter(function(e){return e});

    console.log(adicionalesSeleccionados);

    // localStorageService.set('adicionales'+count, adicionalesSeleccionados);

    var mesa = localStorageService.get('numMesa');

    var pedido = {
      id_user: idUser,
      mesa: mesa,
      plato: $scope.platoSelect.nombrePlato,
      precio: $scope.platoSelect.valor,
      imagen: $scope.platoSelect.imagen,
      estado: 'en proceso',
      ingredientes: IngredientesSeleccionados,
      adicionales:adicionalesSeleccionados
    };

    var valorPedido = localStorageService.get('valorPedido');

    if (valorPedido != null) {
      localStorageService.set('valorPedido', parseInt($scope.platoSelect.valor)+parseInt(valorPedido));
    }else{
      
      localStorageService.set('valorPedido', parseInt($scope.platoSelect.valor));
    }


    localStorageService.set('pedido'+count, pedido);


    count++;
    localStorageService.set('count', count);

    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    $state.go('app.resumen');
     //$location.path('app/resumen');
    }

});













// controlador para mostrar el resumen de pedidos de la mesaActual
app.controller('ResumenCtrl', function($scope, $location, localStorageService, Pedidos, $ionicLoading, $timeout, $ionicHistory, $state){
  $scope.total = localStorageService.get('valorPedido');

   // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $timeout(function () {
      $ionicLoading.hide();
      // obtener los pedidos de la mesa que estan en el local storage
      var count = localStorageService.get('count');
      var pedidosMesaActual = [];

      for (var i = 0; i <= count; i++) {
        pedidosMesaActual[i] = localStorageService.get('pedido'+i);

      };

      $scope.misPedidos = pedidosMesaActual.filter(Boolean);
      console.log('PEDIDOS DE LA MESA');
      console.log($scope.misPedidos);
    }, 1000);

   // función para realizar un nuevo pedido en la mesa actual
    $scope.otroPedido = function(){
      //$location.url('/app/menuCategorias');
      // $ionicHistory.clearHistory();
      // $ionicHistory.clearCache();

      $state.go('app.menuCategorias');
    };

  // función para enviar el pedido, despúes de esto elfilter pedido llegará al mesero
  // luego de confirmar el envío se le redireccionará al resumen desde donde podrá realizar 
  // un nuevo pedido que quedará asignado a la mesa actual
  $scope.enviarPedido = function(){
    var mesa = localStorageService.get('numMesa');
     // obtener los pedidos de la mesa que estan en el local storage

    var count = localStorageService.get('count');
    var pedidoFinal = [];
    var ingredientesFinal = new Array();
    var adicionalFinal = new Array();

    for (var i = 0; i <= count; i++) {
      pedidoFinal[i] = localStorageService.get('pedido'+i);

      Pedidos.$add(localStorageService.get('pedido'+i));
      // ingredientesFinal[i] = localStorageService.get('ingredientes'+i);
      // adicionalFinal[i] = localStorageService.get('adicionales'+i);

      // ingredientesFinal.push(localStorageService.get('ingredientes'+i));
      // adicionalFinal.push(localStorageService.get('adicionales'+i));

    };


    $scope.miPedidoFianal = pedidoFinal.filter(Boolean);
    // $scope.miingredientesFinal = ingredientesFinal.filter(Boolean);
    // $scope.miadicionalFinal = adicionalFinal.filter(Boolean);

    console.log($scope.miPedidoFianal);
    // console.log( $scope.miingredientesFinal);
    // console.log($scope.miadicionalFinal);

    // $scope.miPedidoFianal.mesa = mesa;

    

    // Pedidos.$add({
    //   mesa: mesa,
    //   pedido: $scope.miPedidoFianal,
    //   ingredientes: $scope.miingredientesFinal,
    //   adicionales: $scope.miadicionalFinal
    // });
      // $scope.miPedidoFianal, $scope.miingredientesFinal, $scope.miadicionalFinal

    // ciclo para eliminar los datos del local storage
    for (var i = 0; i <= count; i++) {
      localStorageService.remove('idCategoria', 'idPlato', 'pedido'+i, 'ingredientes'+i, 'adicionales'+i);

    };

    localStorageService.set('count', 1);



  };

});










app.controller('del-diaCtrl', function($scope, $firebaseArray, localStorageService, $timeout, $ionicLoading, $state){
  
  // Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });


  var id_user = localStorageService.get('idUser');


  var count = 0;
  var listPromo = [];

  var promos = new Firebase("https://tucocina.firebaseio.com/platos");
    promos.orderByChild("id_user").equalTo(id_user).on("child_added", function(promo) {
    count++;
    listPromo[count] = promo.val();
    listPromo[count].$id = promo.key();
   });

  $timeout(function(){
    $scope.promos = listPromo.filter(Boolean);
    console.log($scope.promos);
     $ionicLoading.hide();
  },1500);

  //funcion para mostrara la visata y la info del plato seleccionado por el usuario
  $scope.pedirPlatoPromo = function(idPlato){
    console.log('ID Plato Seleccionado: '+ idPlato);
    localStorageService.set('idPlato', idPlato);

    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    $state.go('app.platoSeleccionado');


    // $location.url('/app/plato-seleccionado');


  };

});




app.controller('promoSeleccionadaCtrl', function($scope, $location, localStorageService, Pedidos, $ionicHistory, $state){

  var id = localStorageService.get('idPlato');

  var plato = new Firebase("https://tucocina.firebaseio.com/platos/"+id).once('value', function(data){
    $scope.platoSelect = data.val();
    console.log($scope.platoSelect);
  });

  //ingredientes de un plato
  var count = 0;
  var ingredientes = [];

  var ingre = new Firebase("https://tucocina.firebaseio.com/ingredientes/");
  ingre.orderByChild("idPlato").equalTo(id).on("child_added", function(ingrediente) {
    count++;
    ingredientes[count] = ingrediente.val();
    ingredientes[count].$id = ingrediente.key();
    $scope.ingredientesPlato = ingredientes.filter(Boolean);

    
    // console.log('Listado de ingredientes');
    // console.log($scope.ingredientesPlato);

  });
   
  // adicionales de un plato
  var count = 0;
  var adicionales = [];

  var adi = new Firebase("https://tucocina.firebaseio.com/adicionales/");
  adi.orderByChild("idPlato").equalTo(id).on("child_added", function(adicional) {
    count++;
    adicionales[count] = adicional.val();
    adicionales[count].$id = adicional.key();
    $scope.adicionalesPlato = adicionales.filter(Boolean);


    // console.log('Listado de adicionales');
    // console.log($scope.adicionalesPlato);

  });


  //regresa los pedidos de una sola mesa
  var count = 0;
  var mesaActual = [];

  var numMesa = localStorageService.get('numMesa');
  var miMesa = new Firebase("https://tucocina.firebaseio.com/pedidos/");
  miMesa.orderByChild("mesa").equalTo(numMesa).on("child_added", function(mesa) {
    count++;
    mesaActual[count] = mesa.val();
    //console.log(mesaActual);
    // mesaActual[count].$id = mesa.key();
    $scope.pedidosMesa = mesaActual.filter(Boolean);

    // console.log('Listado de platos de la mesa');
    // console.log($scope.pedidosMesa);

  });


  //función para ver el resumen del pedido
  $scope.verResumen = function(){

    // creo un objeto con el pedido para almacenarlo en el localstorage
    var count = localStorageService.get('count'); //contador para contar la cantidad de pedidos de la mesa

    // identifico ingredientes
    var divCont = document.getElementById('contieneCheck');

    var checkIngredientes = divCont.getElementsByTagName('input');
    var IngredientesSeleccionados = [];

    for(var i = 0; i < checkIngredientes.length; i++){

      if(checkIngredientes[i].checked == true){
        console.log('valor de i: '+ i);
      
      
        if(checkIngredientes[i] != null ){
          console.log(ingrediente);
          var ingrediente = checkIngredientes[i].value;
          IngredientesSeleccionados[i] = ingrediente;
        }
      }
    }
    // remueve elementos null o undefined o 0
    IngredientesSeleccionados = IngredientesSeleccionados.filter(function(e){return e});

    console.log(IngredientesSeleccionados);

    // localStorageService.set('ingredientes'+count, IngredientesSeleccionados);


    // identifico adicionales
    divAdicionales = document.getElementById('checkAdicionales');
    var checkAdicionales = divAdicionales.getElementsByTagName('input');
    var adicionalesSeleccionados = [];

    for(var i = 0; i < checkAdicionales.length; i++){

      if(checkAdicionales[i].checked == true){
        console.log('valor de i: '+ i);
      
      
        if(checkAdicionales[i] != null ){
          console.log(ingrediente);
          var adicional = checkAdicionales[i].value;
          adicionalesSeleccionados[i] = adicional;
        }
      }
    }
     // remueve elementos null o undefined o 0
    adicionalesSeleccionados = adicionalesSeleccionados.filter(function(e){return e});

    console.log(adicionalesSeleccionados);

    // localStorageService.set('adicionales'+count, adicionalesSeleccionados);

    var mesa = localStorageService.get('numMesa');

    var pedido = {
      mesa: mesa,
      plato: $scope.platoSelect.nombrePlato,
      precio: $scope.platoSelect.valor,
      estado: 'en proceso',
      ingredientes: IngredientesSeleccionados,
      adicionales:adicionalesSeleccionados
    };

    localStorageService.set('pedido'+count, pedido);


    count++;
    localStorageService.set('count', count);

    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    $state.go('app.resumen');
     //$location.path('app/resumen');
    }


});







// controlador para traer el pedido actual de una mesa del restaurante
app.controller('TuPedidoCtrl', function($scope, localStorageService){

  //regresa los pedidos de la mesa actual mesa
  var count = 0;
  var mesaActual = [];

  var numMesa = localStorageService.get('numMesa');
  $scope.mesa = numMesa;

  var miMesa = new Firebase("https://tucocina.firebaseio.com/pedidos/");
  miMesa.orderByChild("mesa").equalTo(numMesa).on("child_added", function(mesa) {
    count++;
    mesaActual[count] = mesa.val();
    // mesaActual[count].$id = mesa.key();
    $scope.pedidosMesa = mesaActual.filter(Boolean);

  });

});




// controllador para la funcionalidad de pedir cuenta al mesero
app.controller('pedirCuentaCtrl', function($scope, localStorageService){
  $scope.total = 0;

    //regresa los pedidos de la mesa actual mesa
  var count = 0;
  var mesaActual = [];

  var numMesa = localStorageService.get('numMesa');
  $scope.mesa = numMesa;

  var miMesa = new Firebase("https://tucocina.firebaseio.com/pedidos/");
  miMesa.orderByChild("mesa").equalTo(numMesa).on("child_added", function(mesa) {
    mesaActual[count] = mesa.val();
    // mesaActual[count].$id = mesa.key();
    $scope.pedidosMesa = mesaActual.filter(Boolean);
    console.log($scope.pedidosMesa[count].precio);
    $scope.total = $scope.total + parseInt($scope.pedidosMesa[count].precio);
    count++;

  });


  $scope.pedirCuenta = function(){
    console.log('Hola mundo xD');
  }

});