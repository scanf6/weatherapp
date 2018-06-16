const path=require('path');
const exphbs=require('express-handlebars');
const express=require('express');
const bodyParser=require('body-parser');
const axios=require('axios');
const app=express();
const port=process.env.PORT || 3000;
const API_KEY=process.env.APIKEY;
const DARKSKY=process.env.DARK_API;
const publicPath=path.join(__dirname,'../public');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({extended:false}));


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/',(req,res)=>{
	res.render('index')
});


app.post('/',(req,res)=>{
	var encodedURL = encodeURI(req.body.location);
	
var URLaddress = "https://maps.googleapis.com/maps/api/geocode/json?address="+encodedURL+"&key="+API_KEY;

axios.get(URLaddress).then((response)=>{
	var lat=response.data.results[0].geometry.location.lat;
	var lng=response.data.results[0].geometry.location.lng;
	var weatherURL=`https://api.darksky.net/forecast/${DARKSKY}/${lat},${lng}`;
	return axios.get(weatherURL);
}).then((response)=>{
	console.log(JSON.stringify(response.data, undefined, 2))
		res.render('index',{
			location:req.body.location,
			summary:response.data.currently.summary,
			humidity:response.data.currently.humidity,
			pressure:response.data.currently.pressure,
			temperature:(((response.data.currently.temperature)-32)/1.8).toFixed(2)
		});
		
	}).catch((e)=>{
		res.render('index',{
			error:"Location "+req.body.location+" not found"
		})
	});
});












app.listen(port,()=>{console.log('Server listening on port '+port)});