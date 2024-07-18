const getRequestForServiceProviderFromDatabase = require("../models/RequestModel")

function getAllRequestsForServiceProvider(userId, response){

    console.log(userId)

    getRequestForServiceProviderFromDatabase(userId, (err, result) =>{

        if(err){
            return response({error: "Error getting requests"})
        }

        if(result){
            return response(null, {requests: result})
        }
    })

}


module.exports = getAllRequestsForServiceProvider