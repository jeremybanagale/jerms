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
