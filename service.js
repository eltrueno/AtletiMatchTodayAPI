import dotenv from "dotenv"
dotenv.config()

export async function getAtletiMatchToday() {
    const actualDate = new Date()
    const formattedDate = actualDate.toLocaleDateString("en-CA", {timeZone: "Europe/Madrid", year:"numeric", month: "2-digit", day:"2-digit"})
    const url = `https://api.football-data.org/v4/teams/78/matches?dateFrom=${formattedDate}&dateTo=${formattedDate}`
    const apikey = process.env.API_TOKEN
    try {
        const res = await fetch(url,{
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": apikey
            },
          });
        const rStatusCode = await res.status
        const data = await res.json()
        let response = {}, error
        if(rStatusCode===200){
            let resultSet = data.resultSet
            if(resultSet.count==0){
                response.matchToday = false
            }else{
                const match = data.matches[0]
                response.matchToday = true
                response.isHomeTeam = match.homeTeam.id === 78
                response.homeTeam = match.homeTeam.shortName
                response.awayTeam = match.awayTeam.shortName
                response.competition = match.competition.name
                response.matchDate = match.utcDate
                response.matchfulldata = match
            }
        }else{
            error = data.message
        }
        return {"statuscode": rStatusCode, "response":response, "error":error==undefined?null:error}
    } catch (err) {
        console.log(err.message)
        return {"statuscode": 500, "error": err}
      }
}