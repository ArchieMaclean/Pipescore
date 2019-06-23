let express = require("express");
let app = express();
app.set('view engine', 'pug');
app.set('views','./templates');
app.use(express.static('static'));

app.get('/',(req,res) => {
	res.render('index');
});

app.listen(process.env.PORT || 5000);
