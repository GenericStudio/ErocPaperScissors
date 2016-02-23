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
        record.show_decision_graph = false;
        record.show_previous_games = false;
        record.AddMatch = function (player, ai) {
            record.playerHands.push(player);
            record.aiHands.push(ai);
            var winner = computeWinner(player, ai)
            if (winner == 'Player') record.PlayerWinCount++;
            else if (winner == 'AI') record.AIWinCount++;
            else record.DrawCount++;
            record.winners.push(winner);
            insert_chain_into_tree(record.RPSTree, record.playerHands, winner,record.playerHands.length);
            record.graph = JSONifyTree(record.RPSTree);
            record.graph.index=0;



        }
        var JSONifyTree = function (root) {
            var obj = {};
            obj.children = [];
            obj._children = [];
            obj.Descendants = 0;
            obj.forks_below = 0;
            obj.index = root.index;
            obj.winner = root.winner;
            if (root.parent != undefined) {
                obj.name = root.type;
                obj.parent = root.parent.type;
                obj.score = root.score;
            }
            else {
                obj.name = 'base';
                obj.parent = 'null';
            }


            if (!(root.S == undefined && root.R == undefined && root.P == undefined)) {
                //recurse
                var max_depth = 0;
                var r_child;
                var p_child;
                var s_child;
                if (root.R != undefined) {
                    r_child = JSONifyTree(root.R);
                    obj.children.push(r_child); obj.Descendants += r_child.Descendants;
                    obj.forks_below += r_child.forks_below + 1;
                    if (r_child.depth > max_depth) max_depth = r_child.depth;
                }
                if (root.P != undefined) {
                    p_child = JSONifyTree(root.P);
                    obj.children.push(p_child); obj.Descendants += p_child.Descendants;
                    obj.forks_below += p_child.forks_below + 1;
                    if (p_child.depth > max_depth) max_depth = p_child.depth;
                }
                if (root.S != undefined) {
                    s_child = JSONifyTree(root.S);
                    obj.children.push(s_child); obj.Descendants += s_child.Descendants;
                    obj.forks_below += s_child.forks_below + 1;
                    if (s_child.depth > max_depth) max_depth = s_child.depth;
                }
                obj.depth = max_depth + 1;
                if (obj.children.length > 1)
                    obj.children = obj.children.sort(function (a, b) { return b.depth - a.depth });



                return obj;
            } else {
                //basecase 
                obj.forks_below = 0;
                obj.Descendants += 1;
                obj.depth = 0;
                return obj;
            }
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
        record.RPSTree = {};
        var RPSNode = { parent: undefined, type: '', score: 1, R: undefined, P: undefined, S: undefined };

        function GetWinningHand(hand) {
            if (hand == 'R') return 'P';
            if (hand == 'P') return 'S';
            if (hand == 'S') return 'R';
            return "U";
        }
        function insert_chain_into_tree(tree, root,winner,index) {
            while (root.length > 0) {
                insert_last_hand_into_tree(tree, root,winner,index);
                root = root.slice(1);
            }
        }
        function insert_branch_into_tree(tree, root) {
            var pointer = tree;
            var index = 0;
            while (index < root.length) {
                var next = root[index];
                if (pointer[next] == undefined) {
                    pointer[next] = new_RPSNode(pointer, next);
                } else {
                    pointer[next].score++;
                }
                pointer = pointer[next];
                index++;
            }
        }
        function insert_last_hand_into_tree(tree, root,winner,_index) {
            var pointer = tree;
            var index = 0;
            var increment = false;
            while (index < root.length) {
                var next = root[index];
                if (pointer[next] == undefined) {
                    pointer[next] = new_RPSNode(pointer, next);
                    pointer[next].winner = winner;
                    pointer[next].index = _index;
                    increment = false;
                } else {
                    increment = true;
                }
                pointer = pointer[next];
                index++;
            }
            if (increment) pointer.score++;
        }

        function new_RPSNode(parent, type) {
            if (parent[type] == undefined) {
                var new_node = JSON.parse(JSON.stringify(RPSNode));
                new_node.parent = parent;
                new_node.type = type;
                parent[type] = new_node;
                new_node.winner='Draw';
                return new_node;
            } else {
                return parent[type];
            }

        }


        return record;
    });