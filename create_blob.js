const http = require('https');

const data = JSON.stringify({
    users: [],
    images: {},
    orders: [],
    sales: [],
    offers: {},
    content: {},
    pricing: [],
    services: [],
    collections: {}
});

const options = {
    hostname: 'jsonblob.com',
    port: 443,
    path: '/api/jsonBlob',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Body:', body);
    });
});

req.on('error', (e) => {
    console.error('Error:', e);
});

req.write(data);
req.end();
