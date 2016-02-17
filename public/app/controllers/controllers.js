app.controller('rockPaperScisors', ['$scope', '$http', '$location','aiService','playerService','apiService','recordService', function($scope, $http, $location,aiService,playerService,apiService,recordService) {
    console.log("rockPaperScisors initialized");
    $scope.ai = aiService;
    $scope.record = recordService;
    $scope.api = apiService;
    
    $scope.PlayHand = function(hand){
        if(aiService.handRequested) return ;
        $scope.record.AddMatch(hand, aiService.currentHand);
        aiService.GetNewHand(recordService.session);
    }
    
    
}]);