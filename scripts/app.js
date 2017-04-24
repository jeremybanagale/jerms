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
      )}
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
