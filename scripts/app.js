angular.module("portfolioPage", ["ngMaterial", "ngResource", "ngAnimate", "ui.router"])
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
      }
    })
  })

  .controller('taskCtrl', function($scope, $mdShowToast) {
    $scope.today = new Date();
    $scope.saved = localStorage.getItem('taskItems');
    $scope.taskItem = (localStorage.getItem('taskItems') !== null) ?
      JSON.parse($scope.saved) : [{
        description: "Why not add a task?",
        category: "Personal",
        date: $scope.today,
        complete: false
      }];
    localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));

    $scope.newTask = null;
    $scope.newTaskDate = null;
    $scope.categories = [{
        name: 'Personal'
      },
      {
        name: 'Work'
      },
      {
        name: 'School'
      },
      {
        name: 'Business'
      },
      {
        name: 'Other'
      }
    ];

    $scope.newTaskCategory = $scope.categories;
    $scope.addNew = function() {
      if ($scope.newTaskDate == null || $scope.newTaskDate == '') {
        $scope.taskItem.push({
          description: $scope.newTask,
          date: "No deadline",
          complete: false,
          category: $scope.newTaskCategory.name
        })
      } else {
        $scope.taskItem.push({
          description: $scope.newTask,
          date: $scope.newTaskDate,
          complete: false,
          category: $scope.newTaskCategory.name
        })
      };
      $scope.newTask = '';
      $scope.newTaskDate = '';
      $scope.newTaskCategory = $scope.categories;
      localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
      $mdShowToast.show('Save');
    };

    $scope.deleteTask = function() {
      var completedTask = $scope.taskItem;
      $scope.taskItem = [];
      angular.forEach(completedTask, function(taskItem) {
        if (!taskItem.complete) {
          $scope.taskItem.push(taskItem);
        }
      });
      localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
      $mdShowToast.show('Delete');
    };

    $scope.save = function() {
      localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    };
  })

  .controller('themeCtrl', function($scope) {
    $scope.theme = 'default';
    $scope.changeTheme = function() {
      var themes = ['default', 'indigo', 'lime', 'orange', 'cyan', 'pink', 'brown'];
      var randomize = function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      $scope.theme = randomize(themes);
    };
  })

  .controller('githubCtrl', function($scope, $http, GitReadme, $sce) {
    $scope.getGitInfo = function() {
      $scope.userNotFound = false;
      $scope.loaded = false;
      $http.get("https://api.github.com/users/iamjigz")
        .success(function(data) {
          if (data.name == "") data.name = data.login;
          $scope.user = data;
          $scope.loaded = true;
        })
        .error(function() {
          $scope.userNotFound = true;
        });

      $http.get("https://api.github.com/repos/iamjigz/jigz/commits").success(function(data) {
        $scope.commits = data;
        console.log(data.commit);
        console.log(data['commit']);
        $scope.commitsFound = data.length > 0;
        $scope.limit = 5;
        $scope.maxLimit = data.length;
      });

      GitReadme.getReadme().then(function(resp) {
        $scope.readme = $sce.trustAsHtml(resp.data);
      }).catch(function(resp) {
        console.log("catch", resp);
      });

    }
  })

  .service('GitReadme', function($http) {
    return {
      getReadme: function() {
        return $http.get("https://api.github.com/repos/iamjigz/jigz/readme", {
          headers: {
            "Accept": "application/vnd.github.v3.raw"
          }
        });
      }
    };
  })

  .service('$mdShowToast', function($mdToast) {
    return {
      show: function(content) {
        return $mdToast.show(
          $mdToast.simple()
          .content(content)
          .action('OK')
          .highlightAction(true)
          .highlightClass('md-accent')
          .position('top right')
          .hideDelay(6000)
        )
      }
    };
  })

  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('deep-orange');

    $mdThemingProvider.theme('indigo')
      .primaryPalette('indigo')
      .accentPalette('pink');

    $mdThemingProvider.theme('lime')
      .primaryPalette('lime')
      .accentPalette('deep-orange')

    $mdThemingProvider.theme('orange')
      .primaryPalette('orange')
      .accentPalette('red')

    $mdThemingProvider.theme('cyan')
      .primaryPalette('cyan')
      .accentPalette('indigo')

    $mdThemingProvider.theme('pink')
      .primaryPalette('pink')
      .accentPalette('deep-purple')

    $mdThemingProvider.theme('brown')
      .primaryPalette('brown')
      .accentPalette('grey')

    $mdThemingProvider.alwaysWatchTheme(true);
  })

  .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/tab/dash');
      $stateProvider
      .state('view1', {
          url: "/view1",
          templateUrl: "partials/view1.html"
      })
      .state('view2', {
          url: "/view2",
          templateUrl: "partials/view2.html"
      })
      .state('view3', {
          url: "/view3",
          templateUrl: "partials/view3.html"
      })
      ;
  })

  .controller('tabCtrl', function($scope, $location, $log) {
       $scope.selectedIndex = 0;

       $scope.$watch('selectedIndex', function(current, old) {
           switch (current) {
               case 0:
                   $location.url("/view1");
                   break;
               case 1:
                   $location.url("/view2");
                   break;
               case 2:
                   $location.url("/view3");
                   break;
           }
       });
   })
