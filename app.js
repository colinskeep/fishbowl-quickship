var Fishbowl = require('node-fishbowl').default;
require('dotenv').config()

var fb = new Fishbowl({
    host: process.env.DB_HOST,
    IADescription: process.env.DB_IADescription,
    IAID: process.env.DB_IAID,
    IAName: process.env.DB_IAName,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    bunyanLevel: process.env.DB_bunyanLevel
});


fb.sendRequest({
    action: 'ExecuteQueryRq',
    params: {
        Query: `SELECT customerPO, dateIssued FROM SO WHERE statusId = 20 AND CAST(dateIssued AS DATE) < (CURDATE()-2) ORDER BY dateCreated DESC`
    }
},
    function (error, response) {
        if (error) {
            reject(error)
        }
        else {
            for (i = 0; i < response.length; i++) {
                fb.sendRequest({
                    action: 'QuickShipRq',
                    params: {
                        SONumber: response[i].customerPO,
                        ShipDate: response[i].dateCreated
                    }
                },
                    function (error, response) {
                        if (error) {
                            console.log("error", error)
                        }
                        else {
                            console.log("attempted quickship", response)
                        }
                    })
            }
        }
    }
)


