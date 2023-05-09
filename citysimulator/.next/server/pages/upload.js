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
exports.id = "pages/upload";
exports.ids = ["pages/upload"];
exports.modules = {

/***/ "./pages/components/Upload.js":
/*!************************************!*\
  !*** ./pages/components/Upload.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction Upload() {\n    const [selectedFile, setSelectedFile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [comment, setComment] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const handleFileSelect = (event)=>{\n        setSelectedFile(event.target.files[0]);\n    };\n    const handleCommentChange = (event)=>{\n        setComment(event.target.value);\n    };\n    const handleUpload = async ()=>{\n        const formData = new FormData();\n        formData.append(\"file\", selectedFile);\n        formData.append(\"comment\", comment); // add the comment to the form data\n        try {\n            const response = await fetch(\"http://localhost:5000/api/upload\", {\n                method: \"POST\",\n                body: formData,\n                credentials: \"include\"\n            });\n            const data = await response.json();\n            console.log(data);\n        } catch (error) {\n            console.error(error);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        style: {\n            display: \"flex\",\n            flexDirection: \"column\",\n            alignItems: \"center\"\n        },\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                children: \"Upload a File\"\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                lineNumber: 36,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    marginBottom: \"20px\"\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                        htmlFor: \"fileInput\",\n                        style: {\n                            marginRight: \"10px\"\n                        },\n                        children: \"Select a file:\"\n                    }, void 0, false, {\n                        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                        lineNumber: 38,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                        type: \"file\",\n                        id: \"fileInput\",\n                        onChange: handleFileSelect,\n                        style: {\n                            padding: \"5px 10px\",\n                            borderRadius: \"5px\",\n                            border: \"1px solid #ccc\"\n                        }\n                    }, void 0, false, {\n                        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                        lineNumber: 41,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                lineNumber: 37,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    marginBottom: \"20px\"\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                        htmlFor: \"commentInput\",\n                        style: {\n                            marginRight: \"10px\"\n                        },\n                        children: \"Comment:\"\n                    }, void 0, false, {\n                        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                        lineNumber: 49,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                        type: \"text\",\n                        id: \"commentInput\",\n                        value: comment,\n                        onChange: handleCommentChange,\n                        style: {\n                            padding: \"5px 10px\",\n                            borderRadius: \"5px\",\n                            border: \"1px solid #ccc\",\n                            width: \"300px\"\n                        }\n                    }, void 0, false, {\n                        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                        lineNumber: 52,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                lineNumber: 48,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: handleUpload,\n                style: {\n                    padding: \"10px 20px\",\n                    borderRadius: \"5px\",\n                    background: \"#4caf50\",\n                    color: \"#fff\",\n                    border: \"none\",\n                    cursor: \"pointer\"\n                },\n                children: \"Upload\"\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n                lineNumber: 60,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/components/Upload.js\",\n        lineNumber: 35,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Upload);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9jb21wb25lbnRzL1VwbG9hZC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBd0M7QUFFeEMsU0FBU0UsU0FBUztJQUNoQixNQUFNLENBQUNDLGNBQWNDLGdCQUFnQixHQUFHSCwrQ0FBUUEsQ0FBQyxJQUFJO0lBQ3JELE1BQU0sQ0FBQ0ksU0FBU0MsV0FBVyxHQUFHTCwrQ0FBUUEsQ0FBQztJQUV2QyxNQUFNTSxtQkFBbUIsQ0FBQ0MsUUFBVTtRQUNsQ0osZ0JBQWdCSSxNQUFNQyxNQUFNLENBQUNDLEtBQUssQ0FBQyxFQUFFO0lBQ3ZDO0lBRUEsTUFBTUMsc0JBQXNCLENBQUNILFFBQVU7UUFDckNGLFdBQVdFLE1BQU1DLE1BQU0sQ0FBQ0csS0FBSztJQUMvQjtJQUVBLE1BQU1DLGVBQWUsVUFBWTtRQUMvQixNQUFNQyxXQUFXLElBQUlDO1FBQ3JCRCxTQUFTRSxNQUFNLENBQUMsUUFBUWI7UUFDeEJXLFNBQVNFLE1BQU0sQ0FBQyxXQUFXWCxVQUFVLG1DQUFtQztRQUV4RSxJQUFJO1lBQ0YsTUFBTVksV0FBVyxNQUFNQyxNQUFNLG9DQUFvQztnQkFDL0RDLFFBQVE7Z0JBQ1JDLE1BQU1OO2dCQUNOTyxhQUFhO1lBQ2Y7WUFFQSxNQUFNQyxPQUFPLE1BQU1MLFNBQVNNLElBQUk7WUFDaENDLFFBQVFDLEdBQUcsQ0FBQ0g7UUFDZCxFQUFFLE9BQU9JLE9BQU87WUFDZEYsUUFBUUUsS0FBSyxDQUFDQTtRQUNoQjtJQUNGO0lBRUEscUJBQ0UsOERBQUNDO1FBQUlDLE9BQU87WUFBRUMsU0FBUztZQUFRQyxlQUFlO1lBQVVDLFlBQVk7UUFBUzs7MEJBQzNFLDhEQUFDQzswQkFBRzs7Ozs7OzBCQUNKLDhEQUFDTDtnQkFBSUMsT0FBTztvQkFBRUssY0FBYztnQkFBTzs7a0NBQ2pDLDhEQUFDQzt3QkFBTUMsU0FBUTt3QkFBWVAsT0FBTzs0QkFBRVEsYUFBYTt3QkFBTztrQ0FBRzs7Ozs7O2tDQUczRCw4REFBQ0M7d0JBQ0NDLE1BQUs7d0JBQ0xDLElBQUc7d0JBQ0hDLFVBQVVqQzt3QkFDVnFCLE9BQU87NEJBQUVhLFNBQVM7NEJBQVlDLGNBQWM7NEJBQU9DLFFBQVE7d0JBQWlCOzs7Ozs7Ozs7Ozs7MEJBR2hGLDhEQUFDaEI7Z0JBQUlDLE9BQU87b0JBQUVLLGNBQWM7Z0JBQU87O2tDQUNqQyw4REFBQ0M7d0JBQU1DLFNBQVE7d0JBQWVQLE9BQU87NEJBQUVRLGFBQWE7d0JBQU87a0NBQUc7Ozs7OztrQ0FHOUQsOERBQUNDO3dCQUNDQyxNQUFLO3dCQUNMQyxJQUFHO3dCQUNIM0IsT0FBT1A7d0JBQ1BtQyxVQUFVN0I7d0JBQ1ZpQixPQUFPOzRCQUFFYSxTQUFTOzRCQUFZQyxjQUFjOzRCQUFPQyxRQUFROzRCQUFrQkMsT0FBTzt3QkFBUTs7Ozs7Ozs7Ozs7OzBCQUdoRyw4REFBQ0M7Z0JBQU9DLFNBQVNqQztnQkFBY2UsT0FBTztvQkFBRWEsU0FBUztvQkFBYUMsY0FBYztvQkFBT0ssWUFBWTtvQkFBV0MsT0FBTztvQkFBUUwsUUFBUTtvQkFBUU0sUUFBUTtnQkFBVTswQkFBRzs7Ozs7Ozs7Ozs7O0FBS3BLO0FBRUEsaUVBQWUvQyxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2l0eXNpbXVsYXRvci8uL3BhZ2VzL2NvbXBvbmVudHMvVXBsb2FkLmpzPzY4OGIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiBVcGxvYWQoKSB7XG4gIGNvbnN0IFtzZWxlY3RlZEZpbGUsIHNldFNlbGVjdGVkRmlsZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2NvbW1lbnQsIHNldENvbW1lbnRdID0gdXNlU3RhdGUoJycpO1xuXG4gIGNvbnN0IGhhbmRsZUZpbGVTZWxlY3QgPSAoZXZlbnQpID0+IHtcbiAgICBzZXRTZWxlY3RlZEZpbGUoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVDb21tZW50Q2hhbmdlID0gKGV2ZW50KSA9PiB7XG4gICAgc2V0Q29tbWVudChldmVudC50YXJnZXQudmFsdWUpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIHNlbGVjdGVkRmlsZSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb21tZW50JywgY29tbWVudCk7IC8vIGFkZCB0aGUgY29tbWVudCB0byB0aGUgZm9ybSBkYXRhXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaS91cGxvYWQnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgIDxoMj5VcGxvYWQgYSBGaWxlPC9oMj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMjBweCcgfX0+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZmlsZUlucHV0XCIgc3R5bGU9e3sgbWFyZ2luUmlnaHQ6ICcxMHB4JyB9fT5cbiAgICAgICAgICBTZWxlY3QgYSBmaWxlOlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgaWQ9XCJmaWxlSW5wdXRcIlxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGaWxlU2VsZWN0fVxuICAgICAgICAgIHN0eWxlPXt7IHBhZGRpbmc6ICc1cHggMTBweCcsIGJvcmRlclJhZGl1czogJzVweCcsIGJvcmRlcjogJzFweCBzb2xpZCAjY2NjJyB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzIwcHgnIH19PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvbW1lbnRJbnB1dFwiIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiAnMTBweCcgfX0+XG4gICAgICAgICAgQ29tbWVudDpcbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIGlkPVwiY29tbWVudElucHV0XCJcbiAgICAgICAgICB2YWx1ZT17Y29tbWVudH1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ29tbWVudENoYW5nZX1cbiAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nOiAnNXB4IDEwcHgnLCBib3JkZXJSYWRpdXM6ICc1cHgnLCBib3JkZXI6ICcxcHggc29saWQgI2NjYycsIHdpZHRoOiAnMzAwcHgnIH19XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlVXBsb2FkfSBzdHlsZT17eyBwYWRkaW5nOiAnMTBweCAyMHB4JywgYm9yZGVyUmFkaXVzOiAnNXB4JywgYmFja2dyb3VuZDogJyM0Y2FmNTAnLCBjb2xvcjogJyNmZmYnLCBib3JkZXI6ICdub25lJywgY3Vyc29yOiAncG9pbnRlcicgfX0+XG4gICAgICAgIFVwbG9hZFxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7ICBcbn1cblxuZXhwb3J0IGRlZmF1bHQgVXBsb2FkO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJVcGxvYWQiLCJzZWxlY3RlZEZpbGUiLCJzZXRTZWxlY3RlZEZpbGUiLCJjb21tZW50Iiwic2V0Q29tbWVudCIsImhhbmRsZUZpbGVTZWxlY3QiLCJldmVudCIsInRhcmdldCIsImZpbGVzIiwiaGFuZGxlQ29tbWVudENoYW5nZSIsInZhbHVlIiwiaGFuZGxlVXBsb2FkIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5IiwiY3JlZGVudGlhbHMiLCJkYXRhIiwianNvbiIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsImRpdiIsInN0eWxlIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJhbGlnbkl0ZW1zIiwiaDIiLCJtYXJnaW5Cb3R0b20iLCJsYWJlbCIsImh0bWxGb3IiLCJtYXJnaW5SaWdodCIsImlucHV0IiwidHlwZSIsImlkIiwib25DaGFuZ2UiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwid2lkdGgiLCJidXR0b24iLCJvbkNsaWNrIiwiYmFja2dyb3VuZCIsImNvbG9yIiwiY3Vyc29yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/components/Upload.js\n");

/***/ }),

/***/ "./pages/upload.tsx":
/*!**************************!*\
  !*** ./pages/upload.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_Upload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Upload */ \"./pages/components/Upload.js\");\n\n\n\nfunction UploadPage() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                children: \"Upload a File\"\n            }, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/upload.tsx\",\n                lineNumber: 7,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Upload__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {}, void 0, false, {\n                fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/upload.tsx\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/couto/Desktop/CityInfo/citysimulator/pages/upload.tsx\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UploadPage);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy91cGxvYWQudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMEI7QUFDZTtBQUV6QyxTQUFTRSxhQUFhO0lBQ3BCLHFCQUNFLDhEQUFDQzs7MEJBQ0MsOERBQUNDOzBCQUFHOzs7Ozs7MEJBQ0osOERBQUNILDBEQUFNQTs7Ozs7Ozs7Ozs7QUFHYjtBQUVBLGlFQUFlQyxVQUFVQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2l0eXNpbXVsYXRvci8uL3BhZ2VzL3VwbG9hZC50c3g/M2E4ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFVwbG9hZCBmcm9tICcuL2NvbXBvbmVudHMvVXBsb2FkJztcblxuZnVuY3Rpb24gVXBsb2FkUGFnZSgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGgxPlVwbG9hZCBhIEZpbGU8L2gxPlxuICAgICAgPFVwbG9hZCAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBVcGxvYWRQYWdlO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwiVXBsb2FkIiwiVXBsb2FkUGFnZSIsImRpdiIsImgxIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/upload.tsx\n");

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
var __webpack_exports__ = (__webpack_exec__("./pages/upload.tsx"));
module.exports = __webpack_exports__;

})();