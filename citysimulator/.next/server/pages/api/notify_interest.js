"use strict";
(() => {
var exports = {};
exports.id = 533;
exports.ids = [533];
exports.modules = {

/***/ 986:
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 544:
/***/ ((module) => {

module.exports = import("node-fetch");;

/***/ }),

/***/ 804:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(544);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(860);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(986);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([node_fetch__WEBPACK_IMPORTED_MODULE_0__]);
node_fetch__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const app = express__WEBPACK_IMPORTED_MODULE_1___default()();
// Add the middleware
app.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default().json()); // for parsing application/json
app.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default().urlencoded({
    extended: true
}));
async function handler(req, res) {
    const { file_name  } = req.body;
    // Make a request to the producer to notify interest
    const producerRes = await (0,node_fetch__WEBPACK_IMPORTED_MODULE_0__["default"])("http://producer:5000/api/notify_interest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip" // tell the server you accept gzip encoding
        },
        body: JSON.stringify({
            file_name: file_name
        })
    });
    try {
        const producerJson = await producerRes.json();
        res.status(producerRes.status).json(producerJson);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(804));
module.exports = __webpack_exports__;

})();