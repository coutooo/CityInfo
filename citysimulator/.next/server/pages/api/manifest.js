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
exports.id = "pages/api/manifest";
exports.ids = ["pages/api/manifest"];
exports.modules = {

/***/ "isomorphic-fetch":
/*!***********************************!*\
  !*** external "isomorphic-fetch" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ "(api)/./pages/api/manifest.js":
/*!*******************************!*\
  !*** ./pages/api/manifest.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic-fetch */ \"isomorphic-fetch\");\n/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    const { file  } = req.body;\n    if (!file) {\n        res.status(400).json({\n            error: \"Filename parameter is missing\"\n        });\n        return;\n    }\n    try {\n        //producer:5000\n        const response = await isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default()(`http://localhost:3000/api/manifest?file=${file}`);\n        if (response.ok) {\n            const buffer = await response.buffer();\n            console.log(buffer);\n            res.send(buffer);\n        } else {\n            throw new Error(\"Error: \" + response.status);\n        }\n    } catch (error) {\n        console.log(error);\n        res.status(500).json({\n            error: \"Failed to retrieve manifest\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvbWFuaWZlc3QuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXFDO0FBRXRCLGVBQWVDLFFBQVFDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQzlDLE1BQU0sRUFBRUMsS0FBSSxFQUFFLEdBQUdGLElBQUlHLElBQUk7SUFFekIsSUFBSSxDQUFDRCxNQUFNO1FBQ1RELElBQUlHLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFnQztRQUM5RDtJQUNGLENBQUM7SUFFRCxJQUFJO1FBQ0YsZUFBZTtRQUNmLE1BQU1DLFdBQVcsTUFBTVQsdURBQUtBLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRUksS0FBSyxDQUFDO1FBQzlFLElBQUlLLFNBQVNDLEVBQUUsRUFBRTtZQUNmLE1BQU1DLFNBQVMsTUFBTUYsU0FBU0UsTUFBTTtZQUNwQ0MsUUFBUUMsR0FBRyxDQUFDRjtZQUNaUixJQUFJVyxJQUFJLENBQUNIO1FBQ1gsT0FBTztZQUNMLE1BQU0sSUFBSUksTUFBTSxZQUFZTixTQUFTSCxNQUFNLEVBQUU7UUFDL0MsQ0FBQztJQUNILEVBQUUsT0FBT0UsT0FBTztRQUNkSSxRQUFRQyxHQUFHLENBQUNMO1FBQ1pMLElBQUlHLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUE4QjtJQUM5RDtBQUNGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaXR5c2ltdWxhdG9yLy4vcGFnZXMvYXBpL21hbmlmZXN0LmpzPzc5NGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtZmV0Y2gnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIGNvbnN0IHsgZmlsZSB9ID0gcmVxLmJvZHk7XG5cbiAgaWYgKCFmaWxlKSB7XG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogJ0ZpbGVuYW1lIHBhcmFtZXRlciBpcyBtaXNzaW5nJyB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIC8vcHJvZHVjZXI6NTAwMFxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbWFuaWZlc3Q/ZmlsZT0ke2ZpbGV9YCk7XG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBhd2FpdCByZXNwb25zZS5idWZmZXIoKTtcbiAgICAgIGNvbnNvbGUubG9nKGJ1ZmZlcik7XG4gICAgICByZXMuc2VuZChidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiAnICsgcmVzcG9uc2Uuc3RhdHVzKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gcmV0cmlldmUgbWFuaWZlc3QnIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiZmV0Y2giLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiZmlsZSIsImJvZHkiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJyZXNwb25zZSIsIm9rIiwiYnVmZmVyIiwiY29uc29sZSIsImxvZyIsInNlbmQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/manifest.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/manifest.js"));
module.exports = __webpack_exports__;

})();