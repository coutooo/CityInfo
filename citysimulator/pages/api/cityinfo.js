const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const os = require('os');
const path = require('path');

const keyfile = getKeyfile("forum");

//const filePath = path.join(__dirname,'..','..','..','pyclient','wallet','cityinfo_client.py');

const clientArgs = [
    '/project/cityinfo/pyclient/wallet/cityinfo_client.py',
    //filePath,
    //'/home/couto/Desktop/CityInfo/pyclient/wallet/cityinfo_client.py',
    'http://rest-api:8008',
    keyfile
];

const clientProcess = spawn('python', clientArgs);

clientProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

clientProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

clientProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
    const { text, customerName } = req.body;
    
    const pyArgs = [
        '/home/couto/Desktop/CityInfo/pyclient/cityinfo_cli.py',
        'send',
        text,
        customerName
    ];
  
    const pyProcess = spawn('python', pyArgs);
  
    pyProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
  
    pyProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
  
    pyProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      
        if (code === 0) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    });
});

function getKeyfile(customerName) {
    const home = os.homedir();
    const keyDir = path.join(home, '.sawtooth', 'keys');
    return path.join(keyDir, `${customerName}.priv`);
}

module.exports = app;