
var cors = require('cors')
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
const { sendStatus } = require('express/lib/response')

var app = express()

// http server to use with express and socket.io.
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors())

// Let mongoose know that we're using the default ES6 promise library.
mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://chat-user:chat-password@cluster0.mpot3.mongodb.net/ChatApp?retryWrites=true&w=majority'

// Message model = Name + schema.
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

// Get all the messages from Mongoose - messages returned in
// 'messages' - these are sent as the response.
app.get('/messages', (req, res) => {
    Message.find( {}, (err, messages) => {
        res.send(messages);
    })
    
})

app.post('/messages', (req, res) => {

    // Create an object for mongoose.
    var message = new Message(req.body);

    message.save()
    .then( () => {
        console.log('Saved.');

        // Returns a promise.
        return Message.findOne({message: 'badword'});
    })
    .then( censored => {
        if (censored) {
            console.log('Censored words found.', censored);
            
            // Any errors will be caught by the catch at the end.
            // This also returns a Promise.
            return Message.remove({_id: censored.id} );
        }

        // Socket.io
        io.emit('message', req.body);
        res.sendStatus(200);
    })
    .catch( (err) => {
        res.sendStatus(500);
        console.error(err);
    })
 
})

// Socket connection - this MUST be 'connection' not 'Connection'.
// Event name must be lower case?
io.on('connection', (socket) => {
    console.log("A user connected.");
})

mongoose.connect(dbUrl, (err) => {
    console.log("DB connected", err)
})

// Use http.listen instead of app to use socket.io.
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})

/*
    See code above for how this is transferred into Promise code.

        Message.findOne({message: 'badword'}, (err, censored) => {
            if (censored) {
                console.log('Censored words found.', censored);
                
                Message.remove({_id: censored.id}, (err) => {
                    console.log('Removed censored message.');
                })
            }
        })
*/