angular.module("portfolioPage", ["ngMaterial", "ngResource", "ngAnimate"])
    .controller("chanceCtrl", function($scope) {
        $scope.title = "My chances of getting hired?";
    })

    .controller('workCtrl', function($scope) {
        $scope.exps = [{
            company: "Big Outsource",
            location: "San Pablo City, Laguna",
            title: 'I.T. Associate',
            period: 'MARCH 2015 - PRESENT',
            tasks: [{
                task: 'Provides technical expertise and analysis to departmental management and staff.'
            }, {
                task: 'Extracts and aggregates data from multiple sources.'
            }, {
                task: 'Perform data management activities and evaluate datasets for data integrity.'
            }, {
                task: 'Handles and relegates tasks to BSIT and BSCS interns from different schools.'
            }]
        }, {
            company: "Telus International",
            location: "Quezon City",
            title: 'Technical Support Representative ',
            period: 'SEPTEMBER 2013 - APRIL 2014',
            tasks: [{
                task: 'Deliver service and support to end-users regarding issues with Magellan GPS car navigation devices.'
            }, {
                task: 'Diagnose and resolve technical hardware and software issues.'
            }]
        }, {
            company: "Stream Global Services",
            location: "Mandaluyong City",
            title: 'Tier 2 Technical Support Representative ',
            period: 'FEBRUARY 2013 - JUNE 2013',
            tasks: [{
                task: 'Deliver service and support to end-users regarding issues with Microsoft Windows Operating Systems via phone or remote-access.'
            }, {
                task: 'Diagnose and resolve technical issues involving Microsoft Windows Operating Systems, application software, mail client, printing systems, networks, computer hardware, and peripheral equipment.'
            }]
        }, {
            company: "Teleperformance",
            location: "Makati City",
            title: 'Technical Support Representative ',
            period: 'NOVEMBER 2011 - NOVEMBER 2012',
            tasks: [{
                task: 'Deliver service and support to end-users regarding issues with Star Wars: The Old Republic via phone or remote-access.'
            }, {
                task: 'Diagnose and resolve technical issues involving installation, compatibility, and connectivity.'
            }, {
                task: 'Answer customer inquiries regarding account and billing concerns.'
            }]
        }, {
            company: "Teletech",
            location: "Lipa City, Batangas",
            title: 'Technical Support Representative ',
            period: 'NOVEMBER 2011 - NOVEMBER 2012',
            tasks: [{
                task: 'Deliver service and support to end-users regarding issues with Hewlett-Packard desktop computers via phone or remote-access.'
            }, {
                task: 'Diagnose and resolve technical issues involving operating systems, application software, mail client, printing systems, networks, computer hardware, and peripheral equipment.'
            }]
        }];
    })

    .controller('listCtrl', function($scope) {
        $scope.skills = [{
            name: "Web Crawling",
            url: 'https://en.wikipedia.org/wiki/Web_crawler'
        }, {
            name: "Git",
            url: 'https://git-scm.com/'
        }, {
            name: "Data Extraction",
            url: 'https://en.wikipedia.org/wiki/Data_extraction'
        }, {
            name: "Pug.js",
            url: 'https://pugjs.org/api/getting-started.html'
        }, {
            name: "Express.js",
            url: 'https://expressjs.com/'
        }, {
            name: "Node.js",
            url: 'https://expressjs.com/'
        }, {
            name: "Angular.js",
            url: 'https://angularjs.org/'
        }, {
            name: "Handlebars.js",
            url: 'http://handlebarsjs.com/'
        }, {
            name: "SASS",
            url: 'http://sass-lang.com/'
        }, {
            name: "Stylus",
            url: 'http://stylus-lang.com/'
        }, {
            name: "MongoDB",
            url: 'https://www.mongodb.com/'
        }, {
            name: "Microsoft SQL Server",
            url: 'https://www.microsoft.com/en-us/sql-server'
        }, {
            name: "Google Apps Script",
            url: 'https://developers.google.com/apps-script/'
        }, {
            name: "API",
            url: 'https://en.wikipedia.org/wiki/Application_programming_interface'
        }];
    })

    .controller('chartCtrl', function($scope) {
        $scope.languages = [{
            name: "PHP",
            percent: "60%",
            offset: '351'
        }, {
            name: "VB.NET",
            percent: "75%",
            offset: '481'
        }, {
            name: "Python",
            percent: "45%",
            offset: '281'
        }, {
            name: "Javascript",
            percent: "80%",
            offset: '521'
        }, {
            name: "HTML/CSS",
            percent: "58%",
            offset: '321'
        }, ];
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
    })
