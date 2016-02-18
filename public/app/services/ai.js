angular.module('ai', [])
    .factory('aiService', function ($http, apiService, recordService) {
        console.log("Initializing ai");
        var ai = {};


        ai.GetNewHand = function (session,winning) {
            ai.handRequested = true;
            apiService.GetNextHand(session,recordService.playerHands,winning,GetNextHand_Success);
        }
         var GetNextHand_Success = function (results) {
                recordService.decision = results.data;
                ai.handRequested = false;
                ai.currentHand = results.hand;
            }

        apiService.GetNextHand(undefined,recordService.playerHands,false,GetNextHand_Success);
        return ai;
    });