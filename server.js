var express = require('express'),
    jwt = require('express-jwt'),
    bodyParser = require('body-parser'),
    request = require('request'),
    path = require('path'),
    xlsx = require('node-xlsx'),
    mongodb = require('mongodb'),
    fs = require('fs'),
    app = express();

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://generocusername:qazwsx@ds062438.mongolab.com:62438/MongoLab-e4';
// tell your app to use the modules
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/hand', function (req, res) {

});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/save', function (req, res) {
    console.log(req.body);
    if (req.body != undefined && req.body.length > 0) {
        FileRecord[0].data.push(req.body);
        var buffer = xlsx.build([{ name: "mySheetName", data: FileRecord[0].data }]); // returns a buffer
        var stream = fs.createWriteStream(__dirname + "/public/app/data/RPSRecords.xlsx");
        stream.once('open', function (fd) {
            stream.write(buffer);
            stream.end();
        });

    }

});
app.post('/getNext', function (req, res) {
    var max_length = 30;
    var prior = req.body.prior;
    var record = prior.slice(0);


    if (prior != undefined && prior.length > 0) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) {
                console.log(err);
            }
            else {

                mongoUpsert(db, 'games', { _id: req.body.session, hands: record }, function (user_res) {
                    //  console.log(user_res);
                    db.close();
                });
            }
            console.log('Disconnected from server successfully');
        });
        if (prior.length > max_length) prior = prior.slice(prior.length - max_length);
        insert_chain_into_tree(RPSTree, prior);
        res.send(GetWinningHand(ComputeBestChoice(RPSTree, prior)));
    } else {
        var to_return = "R";
        var score = 0;
        for (var index in RPSTree) {
            var item = RPSTree[index];
            if (item.score > score) {
                to_return = item.type;
                score = item.score;
            }
        }
        to_return = GetWinningHand(to_return);
        res.send(to_return);
    }
    res.end();
});

function mongoUpsert(db, collection_name, data, cb) {
    var collection = db.collection(collection_name);
    collection.save(data, function (err, res) {
        if (err) {
            //  console.log(err);
        }
        else {
            console.log('Inserted into the ' + collection_name + ' collection');
            cb(res);
        }
    });
}
function mongoInsert(db, collection_name, data, cb) {
    var collection = db.collection(collection_name);
    collection.insert(data, function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            //  console.log('Inserted into the ' + collection_name + ' collection');
            cb(res);
        }
    });
}
var GetRandomHand = function () {
    var hands = { 0: "R", 1: "P", 2: "S" }
    return hands[getRandomInt(0, 2)];
}
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var GetBestChild = function (pointer) {
    var score = 0;
    var best = undefined;
    if (pointer.R != undefined) {
        if (pointer.R.score > score) {
            best = 'R'; score = pointer.R.score;
        }
    }
    if (pointer.S != undefined) {
        if (pointer.S.score > score) {
            best = 'S'; score = pointer.S.score;
        }
    }
    if (pointer.P != undefined) {
        if (pointer.P.score > score) {
            best = 'P'; score = pointer.P.score;
        }
    }
    return best;
}
var ComputeBestChoice = function (tree, sequence) {
    var original = sequence.slice(0);
    var R = 0;
    var P = 0;
    var S = 0;
    var index = 0;
    sequence = original.slice(original.length - index);
    while (index <= original.length) {
        index++;
        var tail = GetTail(tree, sequence);

        if (tail != undefined) {
            if (tail.R != undefined)
                R += tail.R.score * index * 3;
            if (tail.P != undefined)
                P += tail.P.score * index * 3;
            if (tail.S != undefined)
                S += tail.S.score * index * 3;
        }
        sequence = original.slice(original.length - index);
    }
    console.log("R: " + R + " P: " + P + " S: " + S);
    if (R > P)
        if (R > S) return 'R';
        else return 'S';
    if (P > S) return 'P';
    return 'S';
}
var GetTail = function (tree, sequence) {
    var pointer = tree;
    var index = 0;
    while (index < sequence.length) {
        var next = sequence[index];
        if (pointer[next] == undefined) {
            return undefined;
        }
        pointer = pointer[next];
        index++;
    }
    return pointer;
}
app.get('/load', function (req, res) {
    //buildTreeFromFile();
});
var RPSTree = {};
var RPSNode = { parent: undefined, type: '', score: 1, R: undefined, P: undefined, S: undefined };
var RPSTree = {};
var FileRecord = {};
function buildTreeFromFile() {
    RPSTree = {};
    FileRecord = xlsx.parse(__dirname + '/public/app/data/RPSRecords.xlsx');
    for (var i in FileRecord[0].data) {
        var row = FileRecord[0].data[i];
        insert_chain_into_tree(RPSTree, row);
    }
}
function buildTreeFromDB() {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log(err);
        }
        else {

            mongoQueryAll(db, 'games', function (user_res) {
                console.log(user_res);
                db.close();
            });
        }
        console.log('Disconnected from server successfully');
    });
}
function mongoQueryAll(db, collection_name, data, cb) {

    var collection = db.collection(collection_name);
    collection.find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            for (var index in docs) {
                var row = docs[index];
                insert_chain_into_tree(RPSTree, row);
            }
        }
    });

}
function GetWinningHand(hand) {
    if (hand == 'R') return 'P';
    if (hand == 'P') return 'S';
    if (hand == 'S') return 'R';
    return "U";
}
function insert_chain_into_tree(tree, root) {
    var index = 0;

    while (root.length > 0) {
        insert_branch_into_tree(tree, root);
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
function insert_last_hand_into_tree(tree, root) {
    var pointer = tree;
    var index = 0;
    var increment = false;
    while (index < root.length) {
        var next = root[index];
        if (pointer[next] == undefined) {
            pointer[next] = new_RPSNode(pointer, next);
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
        new_node.type = type;
        parent[type] = new_node;
        return new_node;
    } else {
        return parent[type];
    }

}

buildTreeFromDB();
app.listen(process.env.PORT || 80);