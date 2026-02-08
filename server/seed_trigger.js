const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses/seed',
    method: 'POST'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Seeding result:', data);
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    process.exit(1);
});

req.end();
