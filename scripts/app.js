angular.module("portfolioPage", ["ngMaterial", "ngResource"])
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
            percent: "30%",
            offset: '181'
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
