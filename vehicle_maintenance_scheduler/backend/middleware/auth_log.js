const express= require('express');
const router= express.Router();
const http= require('http');
const buffer= require('Buffer');
function auth_log(stack, level, package, message){
        if(stack==="backend"||stack==="frontend"){
            if(level==="debug"||level==="info"||level==="warn"||level==="error"||level==="fatal"){
                if(package==="cache"||package==="controller"||package==="cron_job"||package==="db"||package==="domain"||package==="handler"||package==="repository"||package==="route"||package==="service"){
                    const postData= JSON.stringify({'stack':stack, 'level':level, 'package':package, 'message':message});
                    const options= {
                        hostname: 'http://20.207.122.201/evaluation-service/logs',
                        port: 80,
                        path: 'evaluation-service/auth',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData),
                        },
                    }
                    const req = http.request(options, (res) => {
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        console.log(`BODY: ${chunk}`);
                    });
                    res.on('end', () => {
                        console.log('No more data in response.');
                    });
                    });
                    req.on('error', (e) => {
                    console.error(`problem with request: ${e.message}`);
                    });
                    req.write(postData);
                    req.end();
                }
            }
        }
    }
    module.exports= auth_log;