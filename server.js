const express = require('express');
const app = express();
const path = require('path');

app.use('/assets', express.static(__dirname + '/assets'));
app.set('view engine', 'ejs')

app.get('*', (req, res) => {
  res.render('index');
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});
