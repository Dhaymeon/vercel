const express = require("express");
const bodyParser = require("body-parser");
const http = require("http"); // creates client functionality.
const app = express();
const port = 3000;


app.use(bodyParser.json()) // it tells the express to accept every body.
app.use(express.json()) //it tells the express to accept every post request.


app.use("/api/v1", require("./routes"))

app.use("/", (req,res)=>{
    res.send("Welcome Home!")
})

app.listen(port, () => console.log(`app listening to ${port}`)); //mainly for localhost

