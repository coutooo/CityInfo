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
exports.id = "pages/test";
exports.ids = ["pages/test"];
exports.modules = {

/***/ "./pages/components/TextBox.js":
/*!*************************************!*\
  !*** ./pages/components/TextBox.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// components/TextBox.js\n\n\nconst TextBox = ()=>{\n    const [inputText, setInputText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [responseText, setResponseText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const handleTextChange = (e)=>{\n        setInputText(e.target.value);\n    };\n    const handleButtonClick = async ()=>{\n        console.log(\"estou aqui\");\n        try {\n            const response = await fetch(\"http://cityinfo-client:8080/execute\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    text: inputText\n                })\n            });\n            const data = await response.json();\n            setResponseText((prevResponseText)=>prevResponseText + \" \" + data.message); // Update the responseText by accessing the previous state correctly.\n        } catch (error) {\n            console.error(\"Error:\", error);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                type: \"text\",\n                value: inputText,\n                onChange: handleTextChange\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/TextBox.js\",\n                lineNumber: 33,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: handleButtonClick,\n                children: \"Send\"\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/TextBox.js\",\n                lineNumber: 34,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: responseText\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/TextBox.js\",\n                lineNumber: 35,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/TextBox.js\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TextBox);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9jb21wb25lbnRzL1RleHRCb3guanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSx3QkFBd0I7O0FBQ1M7QUFFakMsTUFBTUMsVUFBVSxJQUFNO0lBQ3BCLE1BQU0sQ0FBQ0MsV0FBV0MsYUFBYSxHQUFHSCwrQ0FBUUEsQ0FBQztJQUMzQyxNQUFNLENBQUNJLGNBQWNDLGdCQUFnQixHQUFHTCwrQ0FBUUEsQ0FBQztJQUVqRCxNQUFNTSxtQkFBbUIsQ0FBQ0MsSUFBTTtRQUM5QkosYUFBYUksRUFBRUMsTUFBTSxDQUFDQyxLQUFLO0lBQzdCO0lBRUEsTUFBTUMsb0JBQW9CLFVBQVk7UUFDcENDLFFBQVFDLEdBQUcsQ0FBQztRQUNaLElBQUk7WUFDRixNQUFNQyxXQUFXLE1BQU1DLE1BQU0sdUNBQXVDO2dCQUNsRUMsUUFBUTtnQkFDUkMsU0FBUztvQkFDUCxnQkFBZ0I7Z0JBQ2xCO2dCQUNBQyxNQUFNQyxLQUFLQyxTQUFTLENBQUM7b0JBQUVDLE1BQU1sQjtnQkFBVTtZQUN6QztZQUVBLE1BQU1tQixPQUFPLE1BQU1SLFNBQVNTLElBQUk7WUFFaENqQixnQkFBZ0JrQixDQUFBQSxtQkFBb0JBLG1CQUFtQixNQUFNRixLQUFLRyxPQUFPLEdBQUcscUVBQXFFO1FBQ25KLEVBQUUsT0FBT0MsT0FBTztZQUNkZCxRQUFRYyxLQUFLLENBQUMsVUFBVUE7UUFDMUI7SUFDRjtJQUVBLHFCQUNFLDhEQUFDQzs7MEJBQ0MsOERBQUNDO2dCQUFNQyxNQUFLO2dCQUFPbkIsT0FBT1A7Z0JBQVcyQixVQUFVdkI7Ozs7OzswQkFDL0MsOERBQUN3QjtnQkFBT0MsU0FBU3JCOzBCQUFtQjs7Ozs7OzBCQUNwQyw4REFBQ3NCOzBCQUFHNUI7Ozs7Ozs7Ozs7OztBQUdWO0FBRUEsaUVBQWVILE9BQU9BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaXR5c2ltdWxhdG9yLy4vcGFnZXMvY29tcG9uZW50cy9UZXh0Qm94LmpzP2MxOTUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gY29tcG9uZW50cy9UZXh0Qm94LmpzXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgVGV4dEJveCA9ICgpID0+IHtcbiAgY29uc3QgW2lucHV0VGV4dCwgc2V0SW5wdXRUZXh0XSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3Jlc3BvbnNlVGV4dCwgc2V0UmVzcG9uc2VUZXh0XSA9IHVzZVN0YXRlKCcnKTtcblxuICBjb25zdCBoYW5kbGVUZXh0Q2hhbmdlID0gKGUpID0+IHtcbiAgICBzZXRJbnB1dFRleHQoZS50YXJnZXQudmFsdWUpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUJ1dHRvbkNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiZXN0b3UgYXF1aVwiKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwOi8vY2l0eWluZm8tY2xpZW50OjgwODAvZXhlY3V0ZScsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHRleHQ6IGlucHV0VGV4dCB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgICBzZXRSZXNwb25zZVRleHQocHJldlJlc3BvbnNlVGV4dCA9PiBwcmV2UmVzcG9uc2VUZXh0ICsgJyAnICsgZGF0YS5tZXNzYWdlKTsgLy8gVXBkYXRlIHRoZSByZXNwb25zZVRleHQgYnkgYWNjZXNzaW5nIHRoZSBwcmV2aW91cyBzdGF0ZSBjb3JyZWN0bHkuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2lucHV0VGV4dH0gb25DaGFuZ2U9e2hhbmRsZVRleHRDaGFuZ2V9IC8+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZUJ1dHRvbkNsaWNrfT5TZW5kPC9idXR0b24+XG4gICAgICA8cD57cmVzcG9uc2VUZXh0fTwvcD5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRCb3g7XG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJUZXh0Qm94IiwiaW5wdXRUZXh0Iiwic2V0SW5wdXRUZXh0IiwicmVzcG9uc2VUZXh0Iiwic2V0UmVzcG9uc2VUZXh0IiwiaGFuZGxlVGV4dENoYW5nZSIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSIsImhhbmRsZUJ1dHRvbkNsaWNrIiwiY29uc29sZSIsImxvZyIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0IiwiZGF0YSIsImpzb24iLCJwcmV2UmVzcG9uc2VUZXh0IiwibWVzc2FnZSIsImVycm9yIiwiZGl2IiwiaW5wdXQiLCJ0eXBlIiwib25DaGFuZ2UiLCJidXR0b24iLCJvbkNsaWNrIiwicCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/components/TextBox.js\n");

/***/ }),

/***/ "./pages/test.tsx":
/*!************************!*\
  !*** ./pages/test.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_TextBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/TextBox */ \"./pages/components/TextBox.js\");\n// pages/index.js\n\n\nconst TestPage = ()=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                children: \"Text Box Example\"\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/test.tsx\",\n                lineNumber: 7,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_TextBox__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {}, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/test.tsx\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/test.tsx\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TestPage);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy90ZXN0LnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsaUJBQWlCOztBQUMwQjtBQUUzQyxNQUFNQyxXQUFXLElBQU07SUFDckIscUJBQ0UsOERBQUNDOzswQkFDQyw4REFBQ0M7MEJBQUc7Ozs7OzswQkFDSiw4REFBQ0gsMkRBQU9BOzs7Ozs7Ozs7OztBQUdkO0FBRUEsaUVBQWVDLFFBQVFBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaXR5c2ltdWxhdG9yLy4vcGFnZXMvdGVzdC50c3g/N2ExMCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBwYWdlcy9pbmRleC5qc1xuaW1wb3J0IFRleHRCb3ggZnJvbSAnLi9jb21wb25lbnRzL1RleHRCb3gnO1xuXG5jb25zdCBUZXN0UGFnZSA9ICgpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGgxPlRleHQgQm94IEV4YW1wbGU8L2gxPlxuICAgICAgPFRleHRCb3ggLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRlc3RQYWdlO1xuIl0sIm5hbWVzIjpbIlRleHRCb3giLCJUZXN0UGFnZSIsImRpdiIsImgxIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/test.tsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/test.tsx"));
module.exports = __webpack_exports__;

})();