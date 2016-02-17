app.directive('recordDisplay', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/recordDisplay.html'
    }
});
app.directive('playerInput', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/playerInput.html'
    }
});
app.directive('rockImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Rock.svg'/>"
    }
});
app.directive('paperImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Paper.svg'/>"
    }
});
app.directive('scissorsImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Scissors.svg'/>"
    }
});

app.directive('undecidedImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Undecided.png'/>"
    }
});
app.directive('aiOutput', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/aiOutput.html'
    }
});
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});