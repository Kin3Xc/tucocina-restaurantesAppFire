// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tucocinaApp', ['ionic', 'tucocinaApp.controllers', 'tucocinaApp.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.mesa', {
    url: '/mesa',
    views: {
      'menuContent': {
        templateUrl: 'templates/mesa.html',
        controller: 'MesaCtrl'
      }
    }
  })


  .state('app.menuPrincipal', {
    url: '/menuPrincipal',
    views: {
      'menuContent': {
        templateUrl:'templates/menu-principal.html',
        controller: 'MenuPrincipalCtrl'
      }
    }
  })

  .state('app.menuCategorias', {
    url: '/menuCategorias', 
    views: {
      'menuContent': {
        templateUrl: 'templates/menu-categorias.html',
        controller: 'MenuCategoriasCtrl'
      }
    }
  })

   .state('app.platos', {
    url: '/platos', 
    views: {
      'menuContent': {
        templateUrl: 'templates/platos.html',
        controller: 'PlatosCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
