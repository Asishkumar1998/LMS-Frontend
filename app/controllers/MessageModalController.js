app.controller('MessageModalController',function($scope,$uibModalInstance,modalData){

    $scope.type = modalData.type;
    $scope.title = modalData.title;
    $scope.message = modalData.message;

    $scope.close = function() {
        $uibModalInstance.close();
    };
})