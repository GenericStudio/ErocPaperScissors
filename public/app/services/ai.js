angular.module('ai', [])
    .factory('aiService', function ($http, apiService, recordService) {
        console.log("Initializing ai");
        var ai = {};


        ai.GetNewHand = function (session) {
            ai.handRequested = true;
            apiService.GetNextHand(session,recordService.playerHands,GetNextHand_Success);
        }
         var GetNextHand_Success = function (hand) {
                ai.handRequested = false;
                ai.currentHand = hand;
            }

        apiService.GetNextHand(undefined,recordService.playerHands,GetNextHand_Success);
        return ai;
    });