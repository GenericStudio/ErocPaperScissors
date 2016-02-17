angular.module('api', [])
.service('apiService', function ($http) {
   //console.log("Initializing APIFactory");
    var api = {};
    api.GetNextHand = function(session,prior, successCallBack){
         $http.post("/getNext",{session:session,prior:prior})
        .success(
           function (data, status, headers, config) {
               console.log(data);
              successCallBack(data);
           })
           .error(function (data, status, headers, config) {
              console.log("error");
           });
    } 
    api.GetRandomHand = function(){
       var hands = {0:"R",1:"P",2:"S"}
       return hands[getRandomInt(0,2)];
    }
    api.ServerRefresh = function(){
         $http.get("/load")
        .success(
           function (data, status, headers, config) {
              console.log("success");
           })
           .error(function (data, status, headers, config) {
              console.log("error");
           });
    }
    api.save =function(record){
         $http.post("/save",record)
        .success(
           function (data, status, headers, config) {
              console.log("success");
           })
           .error(function (data, status, headers, config) {
              console.log("error");
           });
    }
    api.ServerRefresh();
    return api;
});