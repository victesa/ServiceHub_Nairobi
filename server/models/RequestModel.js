const db = require("../config/db")

function getRequestForServiceProviderFromDatabase(userId, callBack){
    const query = "SELECT * FROM requests where provider_id = ? "

    db.query(query, [userId], (err, result) =>{

        if(err){
            return callBack(err)
        }

        return callBack(null, result)
    })
}

module.exports = getRequestForServiceProviderFromDatabase