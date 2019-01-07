var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    users = [],
    connections = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));

app.get("/", function(req,res){
    console.log("INDEX");
    res.render("index");
});

io.sockets.on("connection", function(socket){
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  socket.on("disconnect", function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateusernames();
    console.log(users);
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
  });

  socket.on("send message", function(data){
    console.log(data);
    io.sockets.emit("new message",{msg: data, naam: socket.username, color: socket.color});
  });

  socket.on("new user", function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateusernames();
    var colors = ['red' , 'orange' , 'yellow' , 'green' , 'blue' , 'purple' ,'pink'];
    var colornumber = Math.floor(Math.random()*colors.length);
    console.log(colornumber);
    console.log("hmmmm");
    socket.color = colors[colornumber];
    console.log(socket.color);
  });

  function updateusernames(){
    io.sockets.emit("get users", users);
  }
});

server.listen(process.env.PORT || 3000, function () {
  console.log("server started!");
});
