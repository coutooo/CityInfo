"use strict";
(() => {
var exports = {};
exports.id = 378;
exports.ids = [378];
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

/***/ 235:
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
async function handler(req, res) {
    const { file_path , chunk_size  } = req.body;
    // Make a request to the producer to create a manifest
    const producerRes = await (0,node_fetch__WEBPACK_IMPORTED_MODULE_0__["default"])("http://producer:5000/api/manifest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            file_path,
            chunk_size
        })
    });
    const producerJson = await producerRes.json();
    // Return the response from the producer to the client
    res.status(producerRes.status).json(producerJson);
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
var __webpack_exports__ = (__webpack_exec__(235));
module.exports = __webpack_exports__;

})();