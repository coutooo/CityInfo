"use strict";
(() => {
var exports = {};
exports.id = 535;
exports.ids = [535];
exports.modules = {

/***/ 689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 684:
/***/ ((module) => {

module.exports = require("react-dom/server");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 544:
/***/ ((module) => {

module.exports = import("node-fetch");;

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 123:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(544);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_DownloadChunkPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(273);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(684);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_4__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([node_fetch__WEBPACK_IMPORTED_MODULE_1__]);
node_fetch__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];





const path = __webpack_require__(17);
async function handler(req, res) {
    const { chunk_number  } = req.query;
    // Make a request to the producer to request the chunk
    const producerRes = await (0,node_fetch__WEBPACK_IMPORTED_MODULE_1__["default"])(`http://producer:5000/api/request_chunk/${chunk_number}`); // para usar local troca se producer por localhost
    // Download and save the chunk
    const outputDir = path.join(__dirname, "..", "..", "..", "..", "..", "downloads");
    //console.log(outputDir);
    //const outputDir = '/home/couto/Desktop/ndn_block_tests/citysimulator/downloads';
    const file_name = "file"; // meter isto dinamico ou meter "chunk"?
    const chunkFileName = `${file_name}#${chunk_number}.pdf`;
    const chunkFilePath = `${outputDir}/${chunkFileName}`;
    const arrayBuffer = await producerRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(chunkFilePath, buffer);
    // Return a success message
    //res.status(200).json({ message: 'Chunk downloaded successfully' });
    const html = (0,react_dom_server__WEBPACK_IMPORTED_MODULE_4__.renderToString)(/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_DownloadChunkPage__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {}));
    res.status(200).send(`<!DOCTYPE html>${html}`);
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 273:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ DownloadChunkPage)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function DownloadChunkPage() {
    const [chunkNumber, setChunkNumber] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    async function handleDownload() {
        if (!chunkNumber) {
            setMessage("Please enter a chunk number");
            return;
        }
        const response = await fetch(`http://producer:5000/api/request_chunk/${chunk_number}`);
        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
        } else {
            setMessage(`Error: ${data.message}`);
        }
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                children: "Download Chunk"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("progress", {
                value: "100",
                max: "100",
                children: " 100% "
            }),
            message && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                children: message
            })
        ]
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(123));
module.exports = __webpack_exports__;

})();