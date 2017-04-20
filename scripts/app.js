angular.module("portfolioPage", ["ngMaterial", "ngResource", "ngAnimate"])
  .controller("chanceCtrl", function($scope) {
    $scope.title = "Chance to hire is";
  })

  .controller('workCtrl', function($scope) {
    $scope.exps = workExp;

  })

  .controller('skillsCtrl', function($scope) {
    $scope.skills = skills;
  })

  .controller('languageCtrl', function($scope) {
    $scope.languages = languages;

    $scope.reload = function() {
      // location.reload();
      $state.reload();
    }
  })

  .controller('wikiCtrl', function($scope, $resource) {
    $scope.$watch('query', function(newValue, oldValue) {
      if (newValue !== undefined) {
        $scope.wiki = $resource('https://en.wikipedia.org/w/api.php', {
          action: 'opensearch',
          format: 'json',
          search: newValue,
          callback: 'JSON_CALLBACK'
        }, {
          get: {
            method: 'JSONP',
            isArray: true,
            transformResponse: function(data, header) {
              dataSet = [];
              for (var i = 0; i <= data[1].length - 1; i++) {
                var d = {};
                d.name = data[1][i];
                d.snip = data[2][i];
                d.link = data[3][i];
                dataSet.push(d);
              }
              return dataSet;
            }
          }
        });
        $scope.wikiData = $scope.wiki.get()
        console.log($scope.wikiData)
      }
    })
  })

  .controller('locationCtrl', function($scope, $http, $rootScope) {
    $scope.getLoc = function() {
      $scope.myLoc = '';
      //jsonp is required for cross origin requests.
      $http.jsonp("http://ip-api.com/json/?callback=JSON_CALLBACK").
      success(function(data) {
        $scope.myLoc = data;
        console.log('data', data);
        $rootScope.loc = {
          'lat': $scope.myLoc.lat,
          'lon': $scope.myLoc.lon
        };
        //update weather now that we have location
        $rootScope.$emit('updateWeather');
      }).
      error(function(data) {
        $scope.myLoc = "Request failed";
      });
    };

    $scope.getLoc();
  })

  .controller('weatherCtrl', function($scope, $http, $rootScope) {
    //allow cross controller calls.
    $rootScope.$on('updateWeather', function() {
      $scope.getWeather();
    });

    $scope.getWeather = function() {
      $scope.wForecast = '';
      var city = $rootScope.loc;
      $http.jsonp("http://api.openweathermap.org/data/2.5/weather?lat=" + city.lat + "&lon=" + city.lon + "&units=metric&appid=907c6fe2c953ace0643a570472baef1a&callback=JSON_CALLBACK", {
        dataType: 'json'
      }).
      success(function(data) {
        $scope.wForecast = {
          'humidity': data.main.humidity,
          'temp': data.main.temp,
          'abs': data.weather[0]
        };
        console.log('data', data);
      }).
      error(function(data) {
        $scope.woeid = "Request failed";
        console.log('data', data);
      });
    };
  })

  .controller('todoCtrl', function($scope, $rootScope, $timeout) {
    var today = curDate();
    loadList(); // load from local storage

    if (!$scope.toDoList) {
      //dummy values
      $scope.toDoList = [{
        desc: 'Create portfolio...',
        done: true,
        due: '',
        dt: today
      }, {
        desc: 'Send CV and portfolio!',
        done: false,
        due: 'Apr 30, 2017',
        dt: today
      }, {
        desc: 'Pray daily...',
        done: false,
        due: '',
        dt: today
      }];
    };

    //defaults
    $scope.addMode = false;
    $scope.newItem = {
      desc: '',
      done: false,
      due: '',
      dt: today
    };

    //add new item to list
    $scope.addItem = function() {
      $scope.toDoList.push($scope.newItem);
      $scope.newItem = {
        desc: '',
        done: false,
        due: '',
        dt: curDate()
      };
      $scope.toggleForm();
      saveList();
    };

    //toggle add/view mode
    $scope.toggleForm = function() {
      $scope.addMode = !$scope.addMode;
    };

    //clear completed items
    $scope.clearDoneItems = function() {
      var curList = $scope.toDoList;
      $scope.toDoList = [];
      angular.forEach(curList, function(item) {
        if (!item.done) {
          console.log('sss', item);
          $scope.toDoList.push(item);
        }
      });
      //Temp workaround. Manual delete from local storage if still fail.
      document.querySelector('.is-checked').MaterialCheckbox.uncheck();
      saveList();
    };

    function saveList() {
      localStorage.setItem('toDoList', JSON.stringify($scope.toDoList));
      toastThis('Data saved on browser storage.')
    }

    function loadList() {
      var x = localStorage.getItem('toDoList');
      if (x != null) {
        $scope.toDoList = JSON.parse(x);
      }
      toastThis('Data loaded from browser storage.');
    }

    function curDate() {
      var n = Date.now();
      return n;
    };

    //toast status messages
    function toastThis(msg) {
      $rootScope.toast = {
        msg: msg,
        show: true
      };
      $timeout(function() {
        $rootScope.toast.show = false;
      }, 2000);
    }
  })

  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('orange');

    $mdThemingProvider.theme('indigo')
      .primaryPalette('indigo')
      .accentPalette('pink');

    $mdThemingProvider.theme('lime')
      .primaryPalette('lime')
      .accentPalette('orange')

    $mdThemingProvider.theme('orange')
      .primaryPalette('orange')
      .accentPalette('red')

    $mdThemingProvider.alwaysWatchTheme(true);
  })

  .controller('themeCtrl', function($scope) {
    $scope.theme = 'default';
    $scope.changeTheme = function() {
      var themes = ['default', 'indigo', 'lime', 'orange'];
      var randomize = function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      $scope.theme = randomize(themes);
    };
  })
