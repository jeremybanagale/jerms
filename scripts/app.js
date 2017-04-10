angular.module("portfolioPage", ["ngMaterial"])
    .controller("chanceCtrl", function($scope) {
        $scope.title = "My chances of getting hired?";
    })

    .controller('listCtrl', function($scope) {
        $scope.response = {
            text: [
                'Web Crawling',
                'Data Extraction',
                'Git',
                'Pug',
                'Express.js',
                'Node.js',
                'MongoDB',
                'GoogleScript',
                'MS SQL'
            ]
        };
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
