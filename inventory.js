var Fishbowl = require('node-fishbowl').default;

var fb = new Fishbowl({
    host: '192.168.1.146',
    IADescription: 'A node wrapper for Fishbowl Inventory',
    IAID: 2286,
    IAName: 'node-fishbowl',
    password: 'admin1',
    port: 28192,
    username: 'admin',
    bunyanLevel: 'debug'
});


exports.get = (locationId) => {
    fb.sendRequest({
        action: 'ExecuteQueryRq',
        params: {
            Query: `SELECT 

                DISTINCT(part.id), part.num, part.description, 
                IFNULL((SELECT qtyinventory.QTYONHAND FROM qtyinventory WHERE qtyinventory.locationgroupid = 1 AND qtyinventory.partid = part.id),0) AS MAIN

                FROM 

                part 

                RIGHT JOIN defaultlocation on part.Id = defaultlocation.partId 
                RIGHT JOIN tag on tag.locationID = defaultlocation.locationID 
                LEFT JOIN qtyinventory on part.id = qtyinventory.partid

                WHERE tag.num = ${locationId}`
        }
    },
        function (error, response) {
            if (error) {
                reject(error)
            }
            else {
                console.log(response)
                resolve(response)
            }
        }
    )
}
