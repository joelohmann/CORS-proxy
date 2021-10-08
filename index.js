const express = require('express');
const fetch = require('node-fetch');

const app = express();

// Heroku will usually set its own port
const PORT = process.env.PORT || 3000;

// Can change this limit in the Heroku Procfile 
const limit = process.args.hasOwnProperty(2) ? process.args.argv[2] : '100kb';
app.use(express.json({limit: limit}));
console.log('Using limit: ', limit);

app.all('/', (req, res) => {
    // Setting CORS headers for the response
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE",
        "Access-Control-Allow-Headers": req.get('Access-Control-Request-Headers')
    });

    if (req.method === 'OPTIONS') {
        // Send back only the CORS headers for a CORS preflight
        return res.send();
    } else {
        // All other HTTP request methods
        var target = req.get('Target');
        if (!target) {
            return res.status(500).send({Error: "No 'Target' header is present on this request."})
        }

        // Forward the HTTP request and send back its response
        fetch(target, {
            method: req.method,
            headers: req.headers,
            body: req.body,
        }).then(response => res.status(200).send(response))
        .catch(err => console.log(err));
    }
});

app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));