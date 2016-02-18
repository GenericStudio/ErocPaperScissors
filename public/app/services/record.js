angular.module('record', [])
    .factory('recordService', function ($http, apiService) {
        console.log("Initializing recordService");
        var record = {};
        record.playerHands = [];
        record.aiHands = [];
        record.winners = [];
        record.session = guid();
        record.AIWinCount = 0;
        record.DrawCount = 0;
        record.PlayerWinCount = 0;

        record.AddMatch = function (player, ai) {
            record.playerHands.push(player);
            record.aiHands.push(ai);
            var winner = computeWinner(player, ai)
            if (winner == 'Player') record.PlayerWinCount++;
            else if (winner == 'AI') record.AIWinCount++;
            else record.DrawCount++;
            record.winners.push(winner);
            return winner;
        }
        var computeWinner = function (player, ai) {
            if (player == ai) return "Draw";
            if (player == "R") {
                if (ai == "P") {
                    return "AI";
                } else if (ai == "S") {
                    return "Player";
                }
            } else if (player == "P") {
                if (ai == "S") {
                    return "AI";
                } else if (ai == "R") {
                    return "Player";
                }
            } else if (player = "S") {
                if (ai == "R") {
                    return "AI";
                } else if (ai == "P") {
                    return "Player";
                }
            }
        }
        return record;
    });