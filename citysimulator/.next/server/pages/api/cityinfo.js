"use strict";
(() => {
var exports = {};
exports.id = 643;
exports.ids = [643];
exports.modules = {

/***/ 986:
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ 582:
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 81:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 215:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const express = __webpack_require__(860);
const cors = __webpack_require__(582);
const bodyParser = __webpack_require__(986);
const { spawn  } = __webpack_require__(81);
const os = __webpack_require__(37);
const path = __webpack_require__(17);
const keyfile = getKeyfile("forum");
//const filePath = path.join(__dirname,'..','..','..','pyclient','wallet','cityinfo_client.py');
const clientArgs = [
    "/project/cityinfo/pyclient/wallet/cityinfo_client.py",
    //filePath,
    //'/home/couto/Desktop/CityInfo/pyclient/wallet/cityinfo_client.py',
    "http://rest-api:8008",
    keyfile
];
const clientProcess = spawn("python", clientArgs);
clientProcess.stdout.on("data", (data)=>{
    console.log(`stdout: ${data}`);
});
clientProcess.stderr.on("data", (data)=>{
    console.error(`stderr: ${data}`);
});
clientProcess.on("close", (code)=>{
    console.log(`child process exited with code ${code}`);
});
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.post("/send", async (req, res)=>{
    const { text , customerName  } = req.body;
    const pyArgs = [
        "/home/couto/Desktop/CityInfo/pyclient/cityinfo_cli.py",
        "send",
        text,
        customerName
    ];
    const pyProcess = spawn("python", pyArgs);
    pyProcess.stdout.on("data", (data)=>{
        console.log(`stdout: ${data}`);
    });
    pyProcess.stderr.on("data", (data)=>{
        console.error(`stderr: ${data}`);
    });
    pyProcess.on("close", (code)=>{
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
            res.json({
                success: true
            });
        } else {
            res.status(500).json({
                success: false
            });
        }
    });
});
function getKeyfile(customerName) {
    const home = os.homedir();
    const keyDir = path.join(home, ".sawtooth", "keys");
    return path.join(keyDir, `${customerName}.priv`);
}
module.exports = app;


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(215));
module.exports = __webpack_exports__;

})();