angular.module("portfolioPage", ["ngMaterial", "ngResource"])
    .controller("chanceCtrl", function($scope) {
        $scope.title = "My chances of getting hired?";
    })

    .controller('workCtrl', function($scope) {
        $scope.exps = [{
                company: "Big Outsource",
                location: "Laguna",
                title: 'I.T. Associate',
                period: 'MARCH 2015 - PRESENT',
                tasks: [
                    'Provides technical expertise and analysis to departmental management and staff.',
                    ''
                ]
            },
            {
                company: "Big Outsource",
                location: "Laguna",
                title: 'I.T. Associate',
                period: 'MARCH 2015 - PRESENT',
                tasks: [
                    'Provides technical expertise and analysis to departmental management and staff.',
                    ''
                ]
            }
        ];
    })

    .controller('listCtrl', function($scope) {
        $scope.skills = [{
                name: "Web Crawling",
                url: 'https://en.wikipedia.org/wiki/Web_crawler'
            },
            {
                name: "Git",
                url: 'https://git-scm.com/'
            },
            {
                name: "Data Extraction",
                url: 'https://en.wikipedia.org/wiki/Data_extraction'
            },
            {
                name: "Pug.js",
                url: 'https://pugjs.org/api/getting-started.html'
            },
            {
                name: "Express.js",
                url: 'https://expressjs.com/'
            },
            {
                name: "Node.js",
                url: 'https://expressjs.com/'
            },
            {
                name: "Angular.js",
                url: 'https://angularjs.org/'
            },
            {
                name: "Handlebars.js",
                url: 'http://handlebarsjs.com/'
            },
            {
                name: "SASS",
                url: 'http://sass-lang.com/'
            },
            {
                name: "Stylus",
                url: 'http://stylus-lang.com/'
            },
            {
                name: "MongoDB",
                url: 'https://www.mongodb.com/'
            },
            {
                name: "Microsoft SQL Server",
                url: 'https://www.microsoft.com/en-us/sql-server'
            },
            {
                name: "Google Apps Script",
                url: 'https://developers.google.com/apps-script/'
            }
        ];
    })

    .controller('chartCtrl', function($scope) {
        $scope.languages = [{
                name: "PHP",
                percent: "30%",
                offset: '181'
            },
            {
                name: "VB.NET",
                percent: "75%",
                offset: '481'
            },
            {
                name: "Python",
                percent: "45%",
                offset: '281'
            },
            {
                name: "Javascript",
                percent: "80%",
                offset: '521'
            },
            {
                name: "HTML/CSS",
                percent: "58%",
                offset: '321'
            },
        ];
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
