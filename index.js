var express = require('express'),
bodyParser = require('body-parser'),
ejsLayouts = require("express-ejs-layouts"),
peopleCtrl = require("./controllers/people"),
request = require('request'),
app = express();

// tell your app to use the modules
app.use(bodyParser.urlencoded({extended: false}));
app.use(ejsLayouts);
app.use("/people", peopleCtrl);

//Set view engine
app.set('view engine', 'ejs');

//Set the port for the app to run
app.listen(3000);

app.get('/', function(req, res) {
  var qs = {
    s: 'star wars'
  };

  request({
    url: 'http://www.omdbapi.com',
    qs: qs
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var dataObj = JSON.parse(body);
      res.send(dataObj.Search);
    }
  });
});

//Defines several HTTP GET endpoints
app.get('/', function(req, res){
  res.render('index', {name: "Sterling Archer"});
});

//express index route for animals (lists all animals)
app.get('/animals', function(req, res){
    res.render('animals/index', {myAnimals: animals});
});

//express index route for animals (lists all animals)
app.get('/animals/:idx', function(req, res){
    //get array index from url parameter
    var animalIndex = parseInt(req.params.idx);

    //render page with data of the specified animal
    res.render('animals/show', {myAnimal: animals[animalIndex]});
});

//Defines several HTTP POST endpoints
app.post('/animals', function(req, res){
    //add item to animals array
    animals.push(req.body);

    //redirect to the GET /animals route (index)
    res.redirect('/animals');
});



//data variable
var animals=[
    {name:'Neko',type:'cat'},
    {name:'Fido',type:'dog'},
    {name:'Mufasa',type:'lion'},
    {name:'Tony',type:'tiger'},
    {name:'Kuma',type:'bear'}
];
