const express = require('express')
const app = express()



app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!')
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/asteroid', function(req, res){
  res.sendFile(__dirname + '/asteroid/index.html');
  //res.sendFile(path.join(__dirname, 'asteroid', 'index.html'));

});

app.get('/about', function (req, res) {
  res.send('about')
})

app.use(express.static('asteroid'));



