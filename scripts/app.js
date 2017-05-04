
$(function(){
		$('.list li:first-child').click(function(){
			 window.setTimeout(function() {
           $('.profile').slideToggle();
                }, 300);
		});
		$('.list li:nth-child(2)').click(function(){
			 window.setTimeout(function(){
			$('.skills').slideToggle();
					},300);
		});
		$('.list li:nth-child(3)').click(function(){
			 window.setTimeout(function(){
			$('.social').slideToggle();
					},300);
		});
		// $('.list li:nth-child(4)').click(function(){
		// 	 window.setTimeout(function(){
		// 	$('.awards').slideToggle();
		// 		}, 300);
		// });
		// $('.list li:nth-child(5)').click(function(){
		// 	 window.setTimeout(function(){
		// 	$('.quotes').slideToggle();
		// 		}, 300);
		// });
		$('.btn-close').click(function(){
			$('.list-content').hide(300);
		});
	});

angular.module("portfolioPage", ["ngMaterial", "ngResource", "ngAnimate", "ui.router"])
  .controller('appCtrl', function($scope, $mdDialog) {
    $scope.info = profile.info;
    $scope.social = profile.social;

    $scope.showModal = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'partials/modal.html',
        parent: angular.element(document.body),
        scope: $scope,
        preserveScope: true,
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen
      })
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }
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
      .primaryPalette('amber')
      .accentPalette('blue-grey');

    // $mdThemingProvider.theme('indigo')
    //   .primaryPalette('indigo')
    //   .accentPalette('pink');
    //
    // $mdThemingProvider.theme('lime')
    //   .primaryPalette('lime')
    //   .accentPalette('deep-orange')
    //
    // $mdThemingProvider.theme('orange')
    //   .primaryPalette('orange')
    //   .accentPalette('red')
    //
    // $mdThemingProvider.theme('cyan')
    //   .primaryPalette('cyan')
    //   .accentPalette('indigo')
    //
    // $mdThemingProvider.theme('pink')
    //   .primaryPalette('pink')
    //   .accentPalette('deep-purple')
    //
    // $mdThemingProvider.theme('brown')
    //   .primaryPalette('brown')
    //   .accentPalette('grey')

    $mdThemingProvider.alwaysWatchTheme(true);
  });
	// var myCanvas = document.getElementById("J-svg-pentagon");
	// var context =  myCanvas.getContext("2d");
	//
	//
	// function drawPath(x, y, n, r, style) {
	//     var i,ang;
	//     ang = Math.PI*2/n
	//     context.save();
	//
	//     for( var styleList in style) {
	//         context[styleList] = style[styleList];
	//     }
	//     context.translate(x, y);
	//     context.moveTo(0, -r);
	//     context.beginPath();
	//     for(i = 0;i < n; i ++) {
	//         context.rotate(ang)
	//         context.lineTo(0, -r);
	//     }
	//     context.closePath();
	//     context.stroke();
	//     context.fill();
	//     context.restore();
	// }
	// //
	// drawPath(250, 250, 5, 240, {
	//     fillStyle: 'rgba(243, 231, 206, 1)',
	//     lineWidth: '2',
	//     strokeStyle: 'rgba(247, 206, 158, 1)'
	// });
	// drawPath(250, 250, 5, 200, {
	//     fillStyle: '#F6DFAD',
	//     strokeStyle: 'rgba(255, 255, 255, 0)'
	// });
	// drawPath(250, 250, 5, 160, {
	//     fillStyle: '#F7D792',
	//     strokeStyle: 'rgba(255, 255, 255, 0)'
	// });
	// drawPath(250, 250, 5, 120, {
	//     fillStyle: '#F7CF80',
	//     strokeStyle: 'rgba(255, 255, 255, 0)'
	// });
	// drawPath(250, 250, 5, 80, {
	//     fillStyle: '#F8C96D',
	//     strokeStyle: 'rgba(255, 255, 255, 0)'
	// });
	// drawPath(250, 250, 5, 40, {
	//     fillStyle: '#F8C662',
	//     strokeStyle: 'rgba(255, 255, 255, 0)'
	// });
	//
	// var ability = {
	//     num : [3.521,3.12,2.5,3,4.79],
	//     style: {
	//         fillStyle: 'rgba(255, 158, 92, .5)',
	//         lineWidth: '2',
	//         strokeStyle: '#FD7A42'
	//     }
	// }
	function setAbility(x, y, n, r, style, ability) {
	    var i,ang;
	    ang = Math.PI*2/5
	    context.save();
	    //set style
	    for( var styleList in style) {
	        context[styleList] = style[styleList];
	    }
	    context.translate(x, y);
	    context.moveTo(0, -parseFloat(ability[0] * 40 + 40));
	    context.beginPath();
	    //5*40+40
	    for(i = 0;i < n; i ++) {
	        context.rotate(ang)
	        context.lineTo(0, -parseFloat(ability[i] * 40 + 40));
	    }
	    context.closePath();
	    context.stroke();
	    context.fill();
	    context.restore();
	}
	setAbility(250, 250, 5, 100, ability.style, ability.num);
