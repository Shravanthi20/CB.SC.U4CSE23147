const express= require('express');
const middleware= require('../middleware/auth_log');
const http= require('http');
const auth_log = require('../middleware/auth_log');


function serviceRoutes(){
    const router= express.Router();
    router.get("/depots", async(req,result)=>{
        http.get('http://20.207.122.201/evaluation-service/depots', (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            auth_log("backend","error","db","Depots retrieval failed");
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('depots', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
            } catch (e) {
            console.error(e.message);
            }
        });
        }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        });
        });

    router.get("/vehicles", async(req, result)=>{
        http.get('http://20.207.122.201/evaluation-service/vehicles', (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            auth_log("backend","error","db","Depots retrieval failed");
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('vehicles', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
            } catch (e) {
            console.error(e.message);
            }
        });
        }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        });
    });
    return router;
}
module.exports= serviceRoutes;