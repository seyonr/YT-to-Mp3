//Packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//Creating the server
const app = express();

//Port
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//needed to parse html data 
app.use(express.urlencoded({
    extended: true
}))

app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res)=> {
    const videoId = req.body.videoID;
    if(
        videoId === undefined ||
        videoId === "" ||
        videoId === null
    ){
        return res.render("index", {success : false, message: "Please enter a vaild youtube id"});
    }else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,{
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if(fetchResponse.status === "ok")
            return res.render("index", {success : true, song_title: fetchResponse.title, song_link: fetchResponse.link});
        else
            return res.render("index", {success : false, message : fetchResponse.msg})
    }
})

//Starting server
app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`);
})