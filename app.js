angular
    .module('calcApp', ['ngRoute'])
    .config(function($routeProvider){
        
       $routeProvider
        .when('/', {
		   // ruta principal
           templateUrl: './partial-index.html',
           controller: 'indexController' 
        })
        .when('/help', {
           templateUrl: './partial-help.html',
           controller: 'helpController' 
        }) 
        .when('/proveedores', {
           templateUrl: './partial-proveedores.html',
           controller: 'proveedoresController' 
        }) 
        .otherwise("/"); 
    })
    .run(function ($rootScope, $location,$route, $timeout) {
        console.log($location.url());    
        $rootScope.layout = {};
        $rootScope.layout.loading = true;          

        $rootScope.$on('$routeChangeStart', function () {
			//comienzo de route
            console.log('$routeChangeStart');
            //show loading gif
            $timeout(function(){
              $rootScope.layout.loading = true;          
            });
        });
        $rootScope.$on('$routeChangeSuccess', function () {
			// cambio de ruta
            console.log('$routeChangeSuccess');
            //hide loading gif
            $timeout(function(){
				//debugger;
              	$rootScope.layout.loading = false;
            }, 200);
        });
        $rootScope.$on('$routeChangeError', function () {
			// error en la ruta
            //hide loading gif
            console.log('error');
            $rootScope.layout.loading = false;
        });
    })
    .controller('indexController', function($scope){
        console.log("cargo index controller");
    })
    .controller('helpController', function($scope){
        console.log("cargo help controller");
    })
    .controller('proveedoresController', function($scope, $http){
        console.log("cargo proveedores controller");
        $scope.proveedores = [];
		$scope.cargarProveedores = function(prov) {
			$http.post('http://localhost:9001/proveedores', {
				nombre: prov.nombre.$modelValue,
				apellido: prov.apellido.$modelValue,
				edad: prov.edad.$modelValue
			}) 
			.success(function(res){
				console.log("cargo proveedores");
				$scope.listarProveedores();
			});
		}
		$scope.borrarProveedor = function(idProv) {
			$http.delete('http://localhost:9001/proveedores/'+idProv)
			.success(function(res){
				console.log("borro proveedor");
				$scope.listarProveedores();
			});
		}
        $scope.listarProveedores = function(){
            $http.get('http://localhost:9001/proveedores').then(function(res){
                console.log("success!", res);
				//debugger;
                $scope.proveedores = res.data;
            }, function(){
                console.log("error!");
            });
        }
        $scope.listarProveedores();
		//
		// para la edicion de un proveedor
		$scope.editarDatos = [];
		for (var i = 0, length = $scope.proveedores.length; i < length; i++) {
  			$scope.editarDatos[$scope.proveedores[i].id] = false;
		}		
		$scope.editarProveedor = function(prov) {
    		$scope.editarDatos[prov.id] = true;
		}
		$scope.guardarProveedor = function(prov) {
			//debugger;
			/*
			$http.put('http://localhost:9001/proveedores'+prov.id, {
			})
			*/
		}
    })
    .controller('calculadoraController', function($scope, $http){
        $scope.menu = [];
        $http.get('./json/menu.json').then(function(res){
            console.log("success!", res);
            $scope.menu = res.data;
        }, function(){
            console.log("error!");
        });
    });

angular.module('calcApp')
    .directive('calc', function(){
        return {
            restrict: 'AE',
            scope: {},
            templateUrl: './calculadora-partial.html',
            link: function postLink($scope, element, attrs){
                var num = '';
                $scope.tecla = function(t){
                    switch(t){
                        case '=':
                            num = eval(num);
                            break;
                        case 'C': 
                            num = '';
                            break;
                        default:
                            num+=t;
                    }
                    $scope.resultado = num;
                }
            }
        };
    });