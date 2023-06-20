"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/save-manifest";
exports.ids = ["pages/api/save-manifest"];
exports.modules = {

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(api)/./pages/api/save-manifest.js":
/*!************************************!*\
  !*** ./pages/api/save-manifest.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ saveManifestHandler)\n/* harmony export */ });\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n\n\nasync function saveManifestHandler(req, res) {\n    const { filename , buffer  } = req.body;\n    if (!filename || !buffer) {\n        res.status(400).json({\n            error: \"Filename or buffer is missing\"\n        });\n        return;\n    }\n    try {\n        const outputDir = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), \"manifests\");\n        const filePath = path__WEBPACK_IMPORTED_MODULE_0___default().join(outputDir, \"manifest_\" + filename);\n        const bufferData = Buffer.from(buffer);\n        fs__WEBPACK_IMPORTED_MODULE_1___default().writeFileSync(filePath, bufferData);\n        res.status(200).json({\n            message: \"Manifest file saved successfully\"\n        });\n    } catch (error) {\n        console.log(error);\n        res.status(500).json({\n            error: \"Failed to save manifest file\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvc2F2ZS1tYW5pZmVzdC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF3QjtBQUNKO0FBRUwsZUFBZUUsb0JBQW9CQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUMxRCxNQUFNLEVBQUVDLFNBQVEsRUFBRUMsT0FBTSxFQUFFLEdBQUdILElBQUlJLElBQUk7SUFFckMsSUFBSSxDQUFDRixZQUFZLENBQUNDLFFBQVE7UUFDeEJGLElBQUlJLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFnQztRQUM5RDtJQUNGLENBQUM7SUFFRCxJQUFJO1FBQ0YsTUFBTUMsWUFBWVgsZ0RBQVMsQ0FBQ2EsUUFBUUMsR0FBRyxJQUFJO1FBQzNDLE1BQU1DLFdBQVdmLGdEQUFTLENBQUNXLFdBQVcsY0FBWU47UUFFbEQsTUFBTVcsYUFBYUMsT0FBT0MsSUFBSSxDQUFDWjtRQUUvQkwsdURBQWdCLENBQUNjLFVBQVVDO1FBRTNCWixJQUFJSSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVXLFNBQVM7UUFBbUM7SUFDckUsRUFBRSxPQUFPVixPQUFPO1FBQ2RXLFFBQVFDLEdBQUcsQ0FBQ1o7UUFDWk4sSUFBSUksTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQStCO0lBQy9EO0FBQ0YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NpdHlzaW11bGF0b3IvLi9wYWdlcy9hcGkvc2F2ZS1tYW5pZmVzdC5qcz9jZDRjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2F2ZU1hbmlmZXN0SGFuZGxlcihyZXEsIHJlcykge1xuICBjb25zdCB7IGZpbGVuYW1lLCBidWZmZXIgfSA9IHJlcS5ib2R5O1xuXG4gIGlmICghZmlsZW5hbWUgfHwgIWJ1ZmZlcikge1xuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6ICdGaWxlbmFtZSBvciBidWZmZXIgaXMgbWlzc2luZycgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBvdXRwdXREaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ21hbmlmZXN0cycpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKG91dHB1dERpciwgXCJtYW5pZmVzdF9cIitmaWxlbmFtZSk7XG5cbiAgICBjb25zdCBidWZmZXJEYXRhID0gQnVmZmVyLmZyb20oYnVmZmVyKTtcblxuICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIGJ1ZmZlckRhdGEpO1xuXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZXNzYWdlOiAnTWFuaWZlc3QgZmlsZSBzYXZlZCBzdWNjZXNzZnVsbHknIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIHNhdmUgbWFuaWZlc3QgZmlsZScgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJwYXRoIiwiZnMiLCJzYXZlTWFuaWZlc3RIYW5kbGVyIiwicmVxIiwicmVzIiwiZmlsZW5hbWUiLCJidWZmZXIiLCJib2R5Iiwic3RhdHVzIiwianNvbiIsImVycm9yIiwib3V0cHV0RGlyIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJmaWxlUGF0aCIsImJ1ZmZlckRhdGEiLCJCdWZmZXIiLCJmcm9tIiwid3JpdGVGaWxlU3luYyIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/save-manifest.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/save-manifest.js"));
module.exports = __webpack_exports__;

})();