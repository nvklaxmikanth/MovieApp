if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const fetchUrl = require("fetch").fetchUrl;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) =>{
    const query_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=' + process.env.API_KEY;
    fetchUrl(query_url,function(error,meta,body){
        const msg = "What's Popular";
        const data = JSON.parse(body.toString());
        res.render('results',{data,msg});
    });
})

app.post('/results',(req,res) =>{
    const {query} = req.body;
    let q = "";
    for(let v of query){
        if(v == ' '){
            q += '+';
        }
        else{
            q += v;
        }
    }
    const query_url = 'https://api.themoviedb.org/3/search/movie?api_key=' + process.env.API_KEY + '&query=' + q;
    fetchUrl(query_url,function(error,meta,body){
        const data = JSON.parse(body.toString());
        let msg;
        if(data.results.length == 0){
            msg = "No results found based on your search";   
        }
        else{
            msg = "Here are the results based on your search";
        }
        res.render('results',{data,msg});
    })
})

app.get("*",(req,res) => {
    res.send("Hello");
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`On port ${port}`);
})