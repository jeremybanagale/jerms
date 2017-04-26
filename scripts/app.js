angular.module("portfolioPage", ["ngMaterial", "ngResource", "ngAnimate", "ui.router"])
  .controller('appCtrl', function($scope) {
    $scope.info = profile.info;
    $scope.social = profile.social;
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
      $mdShowToast.show('Saved task.');
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
      $mdShowToast.show('Deleted task.');
    };

    $scope.save = function() {
      localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    };
  })

  .controller('githubCtrl', function($scope, $http, getGit, $sce) {
    $scope.getGitInfo = function() {
      $scope.loaded = false;

      getGit.getData("https://api.github.com/users/iamjigz").then(function(res) {
        if (res.data.name == "") res.data.name = res.data.login;

        $scope.user = res.data;
        $scope.loaded = true;
      }).catch(function(res) {
        console.log("catch", res);
      });

      getGit.getData("https://api.github.com/repos/iamjigz/jigz/commits").then(function(res) {
        $scope.commits = res.data;
        $scope.commitsFound = res.data.length > 0;
        $scope.limit = 5;
        $scope.maxLimit = res.data.length;
      }).catch(function(res) {
        console.log("catch", res);
      });

      getGit.getData("https://api.github.com/repos/iamjigz/jigz/readme", true).then(function(res) {
        $scope.readme = $sce.trustAsHtml(res.data);
        getGit.getData("https://api.github.com/repos/iamjigz/jigz/readme").then(function(res) {
          $scope.readmeInfo = res.data;
          console.log(res.data);
        }).catch(function(res) {
          console.log("catch", res);
        });
      }).catch(function(res) {
        console.log("catch", res);
      });
    }
  })

  .service('getGit', function($http) {
    return {
      getData: function(link, bool) {
        if (bool === true) {
          return $http.get(link, {
            headers: {
              "Accept": "application/vnd.github.v3.raw"
            }
          });
        } else {
          return $http.get(link);
        }
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
