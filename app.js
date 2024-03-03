import express from "express";
import bodyparser from "body-parser"
import dotenv from "dotenv"
import {getAtletiMatchToday} from "./service.js"

dotenv.config()

var app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

/*ROOT API ROUTE*/
app.get("/", async (req, res)=> {
    const resp = await getAtletiMatchToday()
    const matchFulldate = new Date(resp.response.matchDate)
    const preMatchDate = new Date(matchFulldate.getTime())
    preMatchDate.setMinutes(preMatchDate.getMinutes()-30)
    resp.response.preMatchDate = preMatchDate.toISOString()
    res.status(resp.statuscode).json(resp.response)
});

var port = process.env.PORT==undefined ? 80 : process.env.PORT
app.set('trust proxy', true)
app.listen(port, '0.0.0.0')
console.log("API Listening on port "+port)