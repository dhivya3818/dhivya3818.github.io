/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sprintf-js/src/sprintf.js":
/*!************************************************!*\
  !*** ./node_modules/sprintf-js/src/sprintf.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* global window, exports, define */

!function() {
    'use strict'

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    }

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments)
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []))
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i]
            }
            else if (typeof parse_tree[i] === 'object') {
                ph = parse_tree[i] // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg == undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                        }
                        arg = arg[ph.keys[k]]
                    }
                }
                else if (ph.param_no) { // positional argument (explicit)
                    arg = argv[ph.param_no]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                    arg = arg()
                }

                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                }

                if (re.number.test(ph.type)) {
                    is_positive = arg >= 0
                }

                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2)
                        break
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10))
                        break
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10)
                        break
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                        break
                    case 'e':
                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                        break
                    case 'f':
                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                        break
                    case 'g':
                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                        break
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8)
                        break
                    case 's':
                        arg = String(arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 't':
                        arg = String(!!arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0
                        break
                    case 'v':
                        arg = arg.valueOf()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16)
                        break
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                        break
                }
                if (re.json.test(ph.type)) {
                    output += arg
                }
                else {
                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                        sign = is_positive ? '+' : '-'
                        arg = arg.toString().replace(re.sign, '')
                    }
                    else {
                        sign = ''
                    }
                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                    pad_length = ph.width - (sign + arg).length
                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output
    }

    var sprintf_cache = Object.create(null)

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt]
        }

        var _fmt = fmt, match, parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0])
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%')
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1])
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key')
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key')
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                }

                parse_tree.push(
                    {
                        placeholder: match[0],
                        param_no:    match[1],
                        keys:        match[2],
                        sign:        match[3],
                        pad_char:    match[4],
                        align:       match[5],
                        width:       match[6],
                        precision:   match[7],
                        type:        match[8]
                    }
                )
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder')
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return sprintf_cache[fmt] = parse_tree
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (true) {
        exports['sprintf'] = sprintf
        exports['vsprintf'] = vsprintf
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf
        window['vsprintf'] = vsprintf

        if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                }
            }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
        }
    }
    /* eslint-enable quote-props */
}(); // eslint-disable-line


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/client/client.js":
/*!******************************!*\
  !*** ./src/client/client.js ***!
  \******************************/
/*! exports provided: ChatClientFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatClientFactory", function() { return ChatClientFactory; });
/* harmony import */ var _core_exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/exceptions */ "./src/core/exceptions.js");
/* harmony import */ var _globalConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../globalConfig */ "./src/globalConfig.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../log */ "./src/log.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






var ChatClientFactoryImpl = /*#__PURE__*/function () {
  function ChatClientFactoryImpl() {
    _classCallCheck(this, ChatClientFactoryImpl);

    this.clientCache = {};
  }

  _createClass(ChatClientFactoryImpl, [{
    key: "getCachedClient",
    value: function getCachedClient(optionsInput) {
      var options = Object.assign({}, optionsInput);
      var region = optionsInput.region || _globalConfig__WEBPACK_IMPORTED_MODULE_1__["GlobalConfig"].getRegion() || _constants__WEBPACK_IMPORTED_MODULE_2__["REGIONS"].pdx;
      options.region = region;

      if (this.clientCache[region]) {
        return this.clientCache[region];
      }

      var client = this._createAwsClient(options);

      this.clientCache[region] = client;
      return client;
    }
  }, {
    key: "_createAwsClient",
    value: function _createAwsClient(options) {
      var region = options.region;
      var endpointOverride = _globalConfig__WEBPACK_IMPORTED_MODULE_1__["GlobalConfig"].getEndpointOverride();
      var endpointUrl = "https://participant.connect.".concat(region, ".amazonaws.com");

      if (endpointOverride) {
        endpointUrl = endpointOverride;
      }

      return new AWSChatClient({
        endpoint: endpointUrl,
        region: region
      });
    }
  }]);

  return ChatClientFactoryImpl;
}();
/*eslint-disable*/


var ChatClient = /*#__PURE__*/function () {
  function ChatClient() {
    _classCallCheck(this, ChatClient);
  }

  _createClass(ChatClient, [{
    key: "sendMessage",
    value: function sendMessage(participantToken, message, type) {
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendTextMessage in ChatClient");
    }
  }, {
    key: "sendAttachment",
    value: function sendAttachment(participantToken, attachment, metadata) {
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendAttachment in ChatClient");
    }
  }, {
    key: "downloadAttachment",
    value: function downloadAttachment(participantToken, attachmentId) {
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("downloadAttachment in ChatClient");
    }
  }, {
    key: "disconnectParticipant",
    value: function disconnectParticipant(participantToken) {
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("disconnectParticipant in ChatClient");
    }
  }, {
    key: "sendEvent",
    value: function sendEvent(connectionToken, contentType, content) {
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendEvent in ChatClient");
    }
  }, {
    key: "createParticipantConnection",
    value: function createParticipantConnection(participantToken, type) {
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("createParticipantConnection in ChatClient");
    }
  }]);

  return ChatClient;
}();
/*eslint-enable*/


var AWSChatClient = /*#__PURE__*/function (_ChatClient) {
  _inherits(AWSChatClient, _ChatClient);

  var _super = _createSuper(AWSChatClient);

  function AWSChatClient(args) {
    var _this;

    _classCallCheck(this, AWSChatClient);

    _this = _super.call(this);
    var creds = new AWS.Credentials('', '');
    var config = new AWS.Config({
      region: args.region,
      endpoint: args.endpoint,
      credentials: creds
    }); // this.chatClient = new AWS.ConnectParticipant(config);

    _this.invokeUrl = args.endpoint;
    _this.logger = _log__WEBPACK_IMPORTED_MODULE_3__["LogManager"].getLogger({
      prefix: "ChatClient"
    });
    return _this;
  }

  _createClass(AWSChatClient, [{
    key: "createParticipantConnection",
    value: function createParticipantConnection(participantToken, type) {
      var self = this;
      var params = {
        Type: type,
        ParticipantToken: participantToken
      };
      var createParticipantConnectionRequest = self.chatClient.createParticipantConnection(params);
      return self._sendRequest(createParticipantConnectionRequest).then(function (res) {
        self.logger.info("successfully create connection request");
        return res;
      })["catch"](function (err) {
        self.logger.error("error when creating connection request");
        return Promise.reject(err);
      });
    }
  }, {
    key: "disconnectParticipant",
    value: function disconnectParticipant(connectionToken) {
      var self = this;
      var params = {
        ConnectionToken: connectionToken
      };
      var disconnectParticipantRequest = self.chatClient.disconnectParticipant(params);
      return self._sendRequest(disconnectParticipantRequest).then(function (res) {
        self.logger.info("successfully disconnect participant");
        return res;
      })["catch"](function (err) {
        self.logger.error("error when disconnecting participant");
        return Promise.reject(err);
      });
    }
  }, {
    key: "getTranscript",
    value: function getTranscript(connectionToken, args) {
      var self = this;
      var params = {
        MaxResults: args.maxResults,
        NextToken: args.nextToken,
        ScanDirection: args.scanDirection,
        SortOrder: args.sortOrder,
        StartPosition: {
          Id: args.startPosition.id,
          AbsoluteTime: args.startPosition.absoluteTime,
          MostRecent: args.startPosition.mostRecent
        },
        ConnectionToken: connectionToken
      };

      if (args.contactId) {
        params.ContactId = args.contactId;
      }

      var getTranscriptRequest = self.chatClient.getTranscript(params);
      console.log("getTranscriptRequest", getTranscriptRequest);
      return self._sendRequest(getTranscriptRequest).then(function (res) {
        self.logger.info("successfully get transcript");
        return res;
      })["catch"](function (err) {
        self.logger.error("error when getting transcript");
        return Promise.reject(err);
      });
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(connectionToken, content, contentType) {
      var self = this;
      var params = {
        Content: content,
        ContentType: contentType,
        ConnectionToken: connectionToken
      };
      var sendMessageRequest = self.chatClient.sendMessage(params);
      return self._sendRequest(sendMessageRequest).then(function (res) {
        self.logger.info("successfully send message");
        return res;
      })["catch"](function (err) {
        self.logger.error("error when sending message");
        return Promise.reject(err);
      });
    }
  }, {
    key: "sendAttachment",
    value: function sendAttachment(connectionToken, attachment, metadata) {
      var self = this;
      var startUploadRequestParams = {
        ContentType: attachment.type,
        AttachmentName: attachment.name,
        AttachmentSizeInBytes: attachment.size,
        ConnectionToken: connectionToken
      };
      var startUploadRequest = self.chatClient.startAttachmentUpload(startUploadRequestParams);
      return self._sendRequest(startUploadRequest).then(function (startUploadResponse) {
        return self._uploadToS3(attachment, startUploadResponse.data.UploadMetadata).then(function () {
          self.logger.info("successfully uploaded attachment");
          var completeUploadRequestParams = {
            AttachmentIds: [startUploadResponse.data.AttachmentId],
            ConnectionToken: connectionToken
          };
          var completeUploadRequest = self.chatClient.completeAttachmentUpload(completeUploadRequestParams);
          return self._sendRequest(completeUploadRequest);
        });
      })["catch"](function (err) {
        self.logger.error("error when sending attachment");
        return Promise.reject(err);
      });
    }
  }, {
    key: "_uploadToS3",
    value: function _uploadToS3(file, metadata) {
      return fetch(metadata.Url, {
        method: "PUT",
        headers: metadata.HeadersToInclude,
        body: file
      });
    }
  }, {
    key: "downloadAttachment",
    value: function downloadAttachment(connectionToken, attachmentId) {
      var self = this;
      var params = {
        AttachmentId: attachmentId,
        ConnectionToken: connectionToken
      };
      var getAttachmentRequest = self.chatClient.getAttachment(params);
      return self._sendRequest(getAttachmentRequest).then(function (response) {
        return self._downloadUrl(response.data.Url);
      })["catch"](function (err) {
        self.logger.error("error when sending attachment");
        return Promise.reject(err);
      });
    }
  }, {
    key: "_downloadUrl",
    value: function _downloadUrl(url) {
      return fetch(url).then(function (t) {
        return t.blob();
      })["catch"](function (err) {
        return Promise.reject(err);
      });
    }
  }, {
    key: "sendEvent",
    value: function sendEvent(connectionToken, contentType, content) {
      var self = this;
      var params = {
        ConnectionToken: connectionToken,
        ContentType: contentType,
        Content: content
      };
      var sendEventRequest = self.chatClient.sendEvent(params);
      return self._sendRequest(sendEventRequest).then(function (res) {
        self.logger.info("successfully send event");
        return res;
      })["catch"](function (err) {
        self.logger.error("error when sending event");
        return Promise.reject(err);
      });
    }
  }, {
    key: "_sendRequest",
    value: function _sendRequest(request) {
      return new Promise(function (resolve, reject) {
        request.on("success", function (res) {
          resolve(res);
        }).on("error", function (err) {
          var errObj = {
            type: err.code,
            message: err.message,
            stack: err.stack ? err.stack.split('\n') : []
          };
          reject(errObj);
        }).send();
      });
    }
  }]);

  return AWSChatClient;
}(ChatClient);

var ChatClientFactory = new ChatClientFactoryImpl();


/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! exports provided: CHAT_CONFIGURATIONS, PARTICIPANT_TOKEN_HEADER, AUTH_HEADER, RESOURCE_PATH, SESSION_TYPES, CHAT_EVENTS, CONTENT_TYPE, EVENT, MESSAGE, TRANSCRIPT_DEFAULT_PARAMS, LOGS_DESTINATION, REGIONS, AGENT_RECONNECT_CONFIG, CUSTOMER_RECONNECT_CONFIG, CONNECTION_TOKEN_POLLING_INTERVAL_IN_MS, CONNECTION_TOKEN_EXPIRY_BUFFER_IN_MS, TRANSPORT_LIFETIME_IN_SECONDS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHAT_CONFIGURATIONS", function() { return CHAT_CONFIGURATIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PARTICIPANT_TOKEN_HEADER", function() { return PARTICIPANT_TOKEN_HEADER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTH_HEADER", function() { return AUTH_HEADER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RESOURCE_PATH", function() { return RESOURCE_PATH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SESSION_TYPES", function() { return SESSION_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHAT_EVENTS", function() { return CHAT_EVENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONTENT_TYPE", function() { return CONTENT_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENT", function() { return EVENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MESSAGE", function() { return MESSAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRANSCRIPT_DEFAULT_PARAMS", function() { return TRANSCRIPT_DEFAULT_PARAMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGS_DESTINATION", function() { return LOGS_DESTINATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGIONS", function() { return REGIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AGENT_RECONNECT_CONFIG", function() { return AGENT_RECONNECT_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CUSTOMER_RECONNECT_CONFIG", function() { return CUSTOMER_RECONNECT_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECTION_TOKEN_POLLING_INTERVAL_IN_MS", function() { return CONNECTION_TOKEN_POLLING_INTERVAL_IN_MS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECTION_TOKEN_EXPIRY_BUFFER_IN_MS", function() { return CONNECTION_TOKEN_EXPIRY_BUFFER_IN_MS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRANSPORT_LIFETIME_IN_SECONDS", function() { return TRANSPORT_LIFETIME_IN_SECONDS; });
//Placeholder
var CHAT_CONFIGURATIONS = {
  CONCURRENT_CHATS: 10
};
var PARTICIPANT_TOKEN_HEADER = "x-amzn-connect-participant-token";
var AUTH_HEADER = "X-Amz-Bearer";
var RESOURCE_PATH = {
  CONNECTION_DETAILS: "/contact/chat/participant/connection-details",
  MESSAGE: "/participant/message",
  TRANSCRIPT: "/participant/transcript",
  EVENT: "/participant/event",
  DISCONNECT: "/participant/disconnect",
  PARTICIPANT_CONNECTION: "/participant/connection",
  ATTACHMENT: "/participant/attachment"
};
var SESSION_TYPES = {
  AGENT: "AGENT",
  CUSTOMER: "CUSTOMER"
};
var CHAT_EVENTS = {
  INCOMING_MESSAGE: "INCOMING_MESSAGE",
  INCOMING_TYPING: "INCOMING_TYPING",
  CONNECTION_ESTABLISHED: "CONNECTION_ESTABLISHED",
  CONNECTION_LOST: "CONNECTION_LOST",
  CONNECTION_BROKEN: "CONNECTION_BROKEN",
  CONNECTION_ACK: "CONNECTION_ACK",
  CHAT_ENDED: "CHAT_ENDED"
};
var CONTENT_TYPE = {
  textPlain: "text/plain",
  textCsv: "text/csv",
  applicationDoc: "application/msword",
  applicationPdf: "application/pdf",
  applicationPpt: "application/vnd.ms-powerpoint",
  applicationXls: "application/vnd.ms-excel",
  imageJpg: "image/jpeg",
  imagePng: "image/png",
  audioWav: "audio/wav",
  connectionAcknowledged: "application/vnd.amazonaws.connect.event.connection.acknowledged",
  typing: "application/vnd.amazonaws.connect.event.typing",
  participantJoined: "application/vnd.amazonaws.connect.event.participant.joined",
  participantLeft: "application/vnd.amazonaws.connect.event.participant.left",
  transferSucceeded: "application/vnd.amazonaws.connect.event.transfer.succeeded",
  transferFailed: "application/vnd.amazonaws.connect.event.transfer.failed",
  chatEnded: "application/vnd.amazonaws.connect.event.chat.ended",
  interactiveMessage: "application/vnd.amazonaws.connect.message.interactive"
};
var EVENT = "EVENT";
var MESSAGE = "MESSAGE";
var TRANSCRIPT_DEFAULT_PARAMS = {
  MAX_RESULTS: 15,
  SORT_ORDER: "ASCENDING",
  SCAN_DIRECTION: "BACKWARD"
};
var LOGS_DESTINATION = {
  NULL: "NULL",
  CLIENT_LOGGER: "CLIENT_LOGGER",
  DEBUG: "DEBUG"
};
var REGIONS = {
  pdx: "us-west-2",
  iad: "us-east-1",
  syd: "ap-southeast-2",
  nrt: "ap-northeast-1",
  fra: "eu-central-1"
};
var AGENT_RECONNECT_CONFIG = {
  interval: 3000,
  maxRetries: 5
};
var CUSTOMER_RECONNECT_CONFIG = {
  interval: 3000,
  maxRetries: 5
};
var CONNECTION_TOKEN_POLLING_INTERVAL_IN_MS = 1000 * 60 * 60 * 12; // 12 hours

var CONNECTION_TOKEN_EXPIRY_BUFFER_IN_MS = 60 * 1000; //1 min

var TRANSPORT_LIFETIME_IN_SECONDS = 3540; // 59 min

/***/ }),

/***/ "./src/core/chatArgsValidator.js":
/*!***************************************!*\
  !*** ./src/core/chatArgsValidator.js ***!
  \***************************************/
/*! exports provided: ChatServiceArgsValidator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatServiceArgsValidator", function() { return ChatServiceArgsValidator; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var ChatControllerArgsValidator = /*#__PURE__*/function () {
  function ChatControllerArgsValidator() {
    _classCallCheck(this, ChatControllerArgsValidator);
  }

  _createClass(ChatControllerArgsValidator, [{
    key: "validateNewControllerDetails",
    value:
    /*eslint-disable no-unused-vars*/
    function validateNewControllerDetails(chatDetails) {
      return true;
    }
    /*eslint-enable no-unused-vars*/

  }, {
    key: "validateSendMessage",
    value: function validateSendMessage(args) {
      if (!_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isString(args.message)) {
        throw new _exceptions__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentException"](args.message + "is not a valid message");
      }

      this.validateContentType(args.contentType);
    }
  }, {
    key: "validateContentType",
    value: function validateContentType(contentType) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsEnum(contentType, Object.values(_constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"]), "contentType");
    }
    /*eslint-disable no-unused-vars*/

  }, {
    key: "validateConnectChat",
    value: function validateConnectChat(args) {
      return true;
    }
    /*eslint-enable no-unused-vars*/

  }, {
    key: "validateLogger",
    value: function validateLogger(logger) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsObject(logger, "logger");
      ["debug", "info", "warn", "error"].forEach(function (methodName) {
        if (!_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(logger[methodName])) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentException"](methodName + " should be a valid function on the passed logger object!");
        }
      });
    }
  }, {
    key: "validateSendEvent",
    value: function validateSendEvent(args) {
      this.validateContentType(args.contentType);
    }
    /*eslint-disable no-unused-vars*/

  }, {
    key: "validateGetMessages",
    value: function validateGetMessages(args) {
      return true;
    }
    /*eslint-enable no-unused-vars*/

  }]);

  return ChatControllerArgsValidator;
}();

var ChatServiceArgsValidator = /*#__PURE__*/function (_ChatControllerArgsVa) {
  _inherits(ChatServiceArgsValidator, _ChatControllerArgsVa);

  var _super = _createSuper(ChatServiceArgsValidator);

  function ChatServiceArgsValidator() {
    _classCallCheck(this, ChatServiceArgsValidator);

    return _super.apply(this, arguments);
  }

  _createClass(ChatServiceArgsValidator, [{
    key: "validateChatDetails",
    value: function validateChatDetails(chatDetails, sessionType) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsObject(chatDetails, "chatDetails");

      if (sessionType === _constants__WEBPACK_IMPORTED_MODULE_2__["SESSION_TYPES"].AGENT && !_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(chatDetails.getConnectionToken)) {
        throw new _exceptions__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentException"]("getConnectionToken was not a function", chatDetails.getConnectionToken);
      }

      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.contactId, "chatDetails.contactId");
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.participantId, "chatDetails.participantId");

      if (sessionType === _constants__WEBPACK_IMPORTED_MODULE_2__["SESSION_TYPES"].CUSTOMER) {
        if (chatDetails.participantToken) {
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.participantToken, "chatDetails.participantToken");
        } else {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_1__["IllegalArgumentException"]("participantToken was not provided for a customer session type", chatDetails.participantToken);
        }
      }
    }
  }, {
    key: "validateInitiateChatResponse",
    value: function validateInitiateChatResponse() {
      return true;
    }
  }, {
    key: "normalizeChatDetails",
    value: function normalizeChatDetails(chatDetailsInput) {
      var chatDetails = {};
      chatDetails.contactId = chatDetailsInput.ContactId || chatDetailsInput.contactId;
      chatDetails.participantId = chatDetailsInput.ParticipantId || chatDetailsInput.participantId;
      chatDetails.initialContactId = chatDetailsInput.InitialContactId || chatDetailsInput.initialContactId || chatDetails.contactId || chatDetails.ContactId;
      chatDetails.getConnectionToken = chatDetailsInput.getConnectionToken || chatDetailsInput.GetConnectionToken;

      if (chatDetailsInput.participantToken || chatDetailsInput.ParticipantToken) {
        chatDetails.participantToken = chatDetailsInput.ParticipantToken || chatDetailsInput.participantToken;
      }

      this.validateChatDetails(chatDetails);
      return chatDetails;
    }
  }]);

  return ChatServiceArgsValidator;
}(ChatControllerArgsValidator);



/***/ }),

/***/ "./src/core/chatController.js":
/*!************************************!*\
  !*** ./src/core/chatController.js ***!
  \************************************/
/*! exports provided: ChatController, NetworkLinkStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatController", function() { return ChatController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkLinkStatus", function() { return NetworkLinkStatus; });
/* harmony import */ var _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connectionHelpers/baseConnectionHelper */ "./src/core/connectionHelpers/baseConnectionHelper.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log */ "./src/log.js");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventbus */ "./src/core/eventbus.js");
/* harmony import */ var _chatArgsValidator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chatArgsValidator */ "./src/core/chatArgsValidator.js");
/* harmony import */ var _connectionHelpers_connectionDetailsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./connectionHelpers/connectionDetailsProvider */ "./src/core/connectionHelpers/connectionDetailsProvider.js");
/* harmony import */ var _connectionHelpers_LpcConnectionHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./connectionHelpers/LpcConnectionHelper */ "./src/core/connectionHelpers/LpcConnectionHelper.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }








var NetworkLinkStatus = {
  NeverEstablished: "NeverEstablished",
  Establishing: "Establishing",
  Established: "Established",
  Broken: "Broken"
};
var ACCESS_DENIED_EXCEPTION = "AccessDeniedException";

var ChatController = /*#__PURE__*/function () {
  function ChatController(args) {
    _classCallCheck(this, ChatController);

    this.logger = _log__WEBPACK_IMPORTED_MODULE_2__["LogManager"].getLogger({
      prefix: "ContactId-" + args.chatDetails.contactId + ": "
    });
    this.argsValidator = new _chatArgsValidator__WEBPACK_IMPORTED_MODULE_4__["ChatServiceArgsValidator"]();
    this.pubsub = new _eventbus__WEBPACK_IMPORTED_MODULE_3__["EventBus"]();
    this.sessionType = args.sessionType;
    this.getConnectionToken = args.chatDetails.getConnectionToken;
    this.connectionDetails = args.chatDetails.connectionDetails;
    this.initialContactId = args.chatDetails.initialContactId;
    this.contactId = args.chatDetails.contactId;
    this.participantId = args.chatDetails.participantId;
    this.chatClient = args.chatClient;
    this.participantToken = args.chatDetails.participantToken;
    this.websocketManager = args.websocketManager;
    this._participantDisconnected = false;
    this.sessionMetadata = {};
  }

  _createClass(ChatController, [{
    key: "subscribe",
    value: function subscribe(eventName, callback) {
      this.pubsub.subscribe(eventName, callback);
      this.logger.info("Subscribed successfully to eventName: ", eventName);
    }
  }, {
    key: "handleRequestSuccess",
    value: function handleRequestSuccess(metadata, request, requestName) {
      var _this = this;

      return function (response) {
        response.metadata = metadata;

        _this.logger.debug("".concat(requestName, " successful! Response: "), response, " / Request: ", request);

        return response;
      };
    }
  }, {
    key: "handleRequestFailure",
    value: function handleRequestFailure(metadata, request, requestName) {
      var _this2 = this;

      return function (error) {
        error.metadata = metadata;

        _this2.logger.debug("".concat(requestName, " failed! Error: "), error, " / Request: ", request);

        return Promise.reject(error);
      };
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(args) {
      var metadata = args.metadata || null;
      this.argsValidator.validateSendMessage(args);
      var connectionToken = this.connectionHelper.getConnectionToken();
      return this.chatClient.sendMessage(connectionToken, args.message, args.contentType).then(this.handleRequestSuccess(metadata, args, "sendMessage"))["catch"](this.handleRequestFailure(metadata, args, "sendMessage"));
    }
  }, {
    key: "sendAttachment",
    value: function sendAttachment(args) {
      var metadata = args.metadata || null; //TODO: validation

      var connectionToken = this.connectionHelper.getConnectionToken();
      return this.chatClient.sendAttachment(connectionToken, args.attachment, args.metadata).then(this.handleRequestSuccess(metadata, args, "sendAttachment"))["catch"](this.handleRequestFailure(metadata, args, "sendAttachment"));
    }
  }, {
    key: "downloadAttachment",
    value: function downloadAttachment(args) {
      var metadata = args.metadata || null;
      var connectionToken = this.connectionHelper.getConnectionToken();
      return this.chatClient.downloadAttachment(connectionToken, args.attachmentId).then(this.handleRequestSuccess(metadata, args, "downloadAttachment"))["catch"](this.handleRequestFailure(metadata, args, "downloadAttachment"));
    }
  }, {
    key: "sendEvent",
    value: function sendEvent(args) {
      var metadata = args.metadata || null;
      this.argsValidator.validateSendEvent(args);
      var connectionToken = this.connectionHelper.getConnectionToken();
      var content = args.content || null;
      return this.chatClient.sendEvent(connectionToken, args.contentType, content).then(this.handleRequestSuccess(metadata, args, "sendEvent"))["catch"](this.handleRequestFailure(metadata, args, "sendEvent"));
    }
  }, {
    key: "getTranscript",
    value: function getTranscript(inputArgs) {
      if (this.connectionHelper.getStatus() === _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__["ConnectionHelperStatus"].Ended) {
        return Promise.reject(ACCESS_DENIED_EXCEPTION);
      }

      var metadata = inputArgs.metadata || null;
      var args = {
        startPosition: inputArgs.startPosition || {},
        scanDirection: inputArgs.scanDirection || _constants__WEBPACK_IMPORTED_MODULE_1__["TRANSCRIPT_DEFAULT_PARAMS"].SCAN_DIRECTION,
        sortOrder: inputArgs.sortOrder || _constants__WEBPACK_IMPORTED_MODULE_1__["TRANSCRIPT_DEFAULT_PARAMS"].SORT_ORDER,
        maxResults: inputArgs.maxResults || _constants__WEBPACK_IMPORTED_MODULE_1__["TRANSCRIPT_DEFAULT_PARAMS"].MAX_RESULTS
      };

      if (inputArgs.nextToken) {
        args.nextToken = inputArgs.nextToken;
      }

      if (inputArgs.contactId) {
        args.contactId = inputArgs.contactId;
      }

      var connectionToken = this.connectionHelper.getConnectionToken();
      return this.chatClient.getTranscript(connectionToken, args).then(this.handleRequestSuccess(metadata, args, "getTranscript"))["catch"](this.handleRequestFailure(metadata, args, "getTranscript"));
    }
  }, {
    key: "connect",
    value: function connect() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.sessionMetadata = args.metadata || null;
      this.argsValidator.validateConnectChat(args);

      var connectionDetailsProvider = this._getConnectionDetailsProvider();

      return connectionDetailsProvider.fetchConnectionToken().then(this._initConnectionHelper.bind(this, connectionDetailsProvider)).then(this._onConnectSuccess.bind(this), this._onConnectFailure.bind(this));
    }
  }, {
    key: "_initConnectionHelper",
    value: function _initConnectionHelper(connectionDetailsProvider) {
      this.connectionHelper = new _connectionHelpers_LpcConnectionHelper__WEBPACK_IMPORTED_MODULE_6__["default"](this.contactId, this.initialContactId, connectionDetailsProvider, this.websocketManager);
      this.connectionHelper.onEnded(this._handleEndedConnection.bind(this));
      this.connectionHelper.onConnectionLost(this._handleLostConnection.bind(this));
      this.connectionHelper.onConnectionGain(this._handleGainedConnection.bind(this));
      this.connectionHelper.onMessage(this._handleIncomingMessage.bind(this));
      return this.connectionHelper.start();
    }
  }, {
    key: "_getConnectionDetailsProvider",
    value: function _getConnectionDetailsProvider() {
      return new _connectionHelpers_connectionDetailsProvider__WEBPACK_IMPORTED_MODULE_5__["default"](this.participantToken, this.chatClient, this.sessionType, this.getConnectionToken);
    }
  }, {
    key: "_handleEndedConnection",
    value: function _handleEndedConnection(eventData) {
      this._forwardChatEvent(_constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].CONNECTION_BROKEN, {
        data: eventData,
        chatDetails: this.getChatDetails()
      });
    }
  }, {
    key: "_handleLostConnection",
    value: function _handleLostConnection(eventData) {
      this._forwardChatEvent(_constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].CONNECTION_LOST, {
        data: eventData,
        chatDetails: this.getChatDetails()
      });
    }
  }, {
    key: "_handleGainedConnection",
    value: function _handleGainedConnection(eventData) {
      this._forwardChatEvent(_constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].CONNECTION_ESTABLISHED, {
        data: eventData,
        chatDetails: this.getChatDetails()
      });
    }
  }, {
    key: "_handleIncomingMessage",
    value: function _handleIncomingMessage(incomingData) {
      try {
        var eventType = incomingData.ContentType === _constants__WEBPACK_IMPORTED_MODULE_1__["CONTENT_TYPE"].typing ? _constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].INCOMING_TYPING : _constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].INCOMING_MESSAGE;

        this._forwardChatEvent(eventType, {
          data: incomingData,
          chatDetails: this.getChatDetails()
        });

        if (incomingData.ContentType === _constants__WEBPACK_IMPORTED_MODULE_1__["CONTENT_TYPE"].chatEnded) {
          this._forwardChatEvent(_constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].CHAT_ENDED, {
            data: null,
            chatDetails: this.getChatDetails()
          });

          this.breakConnection();
        }
      } catch (e) {
        this.logger.error("Error occured while handling message from Connection. eventData: ", incomingData, " Causing exception: ", e);
      }
    }
  }, {
    key: "_forwardChatEvent",
    value: function _forwardChatEvent(eventName, eventData) {
      this.logger.debug("Triggering event for subscribers:", eventName, eventData);
      this.pubsub.triggerAsync(eventName, eventData);
    }
  }, {
    key: "_onConnectSuccess",
    value: function _onConnectSuccess(response) {
      this.logger.info("Connect successful!");
      var responseObject = {
        _debug: response,
        connectSuccess: true,
        connectCalled: true,
        metadata: this.sessionMetadata
      };
      var eventData = Object.assign({
        chatDetails: this.getChatDetails()
      }, responseObject);
      this.pubsub.triggerAsync(_constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"].CONNECTION_ESTABLISHED, eventData);

      if (this._shouldAcknowledgeContact()) {
        this.sendEvent({
          contentType: _constants__WEBPACK_IMPORTED_MODULE_1__["CONTENT_TYPE"].connectionAcknowledged
        });
      }

      return responseObject;
    }
  }, {
    key: "_onConnectFailure",
    value: function _onConnectFailure(error) {
      var errorObject = {
        _debug: error,
        connectSuccess: false,
        connectCalled: true,
        metadata: this.sessionMetadata
      };
      this.logger.error("Connect Failed with data: ", errorObject);
      return Promise.reject(errorObject);
    }
  }, {
    key: "_shouldAcknowledgeContact",
    value: function _shouldAcknowledgeContact() {
      return this.sessionType === _constants__WEBPACK_IMPORTED_MODULE_1__["SESSION_TYPES"].AGENT;
    }
  }, {
    key: "breakConnection",
    value: function breakConnection() {
      return this.connectionHelper ? this.connectionHelper.end() : Promise.resolve();
    } // Do any clean up that needs to be done upon the participant being disconnected from the chat -
    // disconnected here means that the participant is no longer part of ther chat.

  }, {
    key: "cleanUpOnParticipantDisconnect",
    value: function cleanUpOnParticipantDisconnect() {
      this.pubsub.unsubscribeAll();
    }
  }, {
    key: "disconnectParticipant",
    value: function disconnectParticipant() {
      var _this3 = this;

      var connectionToken = this.connectionHelper.getConnectionToken();
      return this.chatClient.disconnectParticipant(connectionToken).then(function (response) {
        _this3.logger.info("disconnect participant successful");

        _this3._participantDisconnected = true;

        _this3.cleanUpOnParticipantDisconnect();

        _this3.breakConnection();

        return response;
      }, function (error) {
        _this3.logger.error("disconnect participant failed with error: ", error);

        return Promise.reject(error);
      });
    }
  }, {
    key: "getChatDetails",
    value: function getChatDetails() {
      return {
        initialContactId: this.initialContactId,
        contactId: this.contactId,
        participantId: this.participantId,
        participantToken: this.participantToken,
        connectionDetails: this.connectionDetails
      };
    }
  }, {
    key: "_convertConnectionHelperStatus",
    value: function _convertConnectionHelperStatus(connectionHelperStatus) {
      switch (connectionHelperStatus) {
        case _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__["ConnectionHelperStatus"].NeverStarted:
          return NetworkLinkStatus.NeverEstablished;

        case _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__["ConnectionHelperStatus"].Starting:
          return NetworkLinkStatus.Establishing;

        case _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__["ConnectionHelperStatus"].Ended:
          return NetworkLinkStatus.Broken;

        case _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__["ConnectionHelperStatus"].ConnectionLost:
          return NetworkLinkStatus.Broken;

        case _connectionHelpers_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_0__["ConnectionHelperStatus"].Connected:
          return NetworkLinkStatus.Established;
      }

      this.logger.error("Reached invalid state. Unknown connectionHelperStatus: ", connectionHelperStatus);
    }
  }, {
    key: "getConnectionStatus",
    value: function getConnectionStatus() {
      return this._convertConnectionHelperStatus(this.connectionHelper.getStatus());
    }
  }]);

  return ChatController;
}();



/***/ }),

/***/ "./src/core/chatSession.js":
/*!*********************************!*\
  !*** ./src/core/chatSession.js ***!
  \*********************************/
/*! exports provided: ChatSessionObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatSessionObject", function() { return ChatSessionObject; });
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
/* harmony import */ var _client_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../client/client */ "./src/client/client.js");
/* harmony import */ var _chatArgsValidator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chatArgsValidator */ "./src/core/chatArgsValidator.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _globalConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../globalConfig */ "./src/globalConfig.js");
/* harmony import */ var _chatController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chatController */ "./src/core/chatController.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../log */ "./src/log.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }









var ChatSessionFactory = /*#__PURE__*/function () {
  function ChatSessionFactory() {
    _classCallCheck(this, ChatSessionFactory);
  }

  _createClass(ChatSessionFactory, [{
    key: "createAgentChatController",
    value:
    /*eslint-disable no-unused-vars*/
    function createAgentChatController(chatDetails, participantType) {
      throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("createAgentChatController in ChatControllerFactory.");
    }
  }, {
    key: "createCustomerChatController",
    value: function createCustomerChatController(chatDetails, participantType) {
      throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("createCustomerChatController in ChatControllerFactory.");
    }
    /*eslint-enable no-unused-vars*/

  }]);

  return ChatSessionFactory;
}();

var PersistentConnectionAndChatServiceSessionFactory = /*#__PURE__*/function (_ChatSessionFactory) {
  _inherits(PersistentConnectionAndChatServiceSessionFactory, _ChatSessionFactory);

  var _super = _createSuper(PersistentConnectionAndChatServiceSessionFactory);

  function PersistentConnectionAndChatServiceSessionFactory() {
    var _this;

    _classCallCheck(this, PersistentConnectionAndChatServiceSessionFactory);

    _this = _super.call(this);
    _this.argsValidator = new _chatArgsValidator__WEBPACK_IMPORTED_MODULE_2__["ChatServiceArgsValidator"]();
    return _this;
  }

  _createClass(PersistentConnectionAndChatServiceSessionFactory, [{
    key: "createChatSession",
    value: function createChatSession(sessionType, chatDetails, options, websocketManager) {
      var chatController = this._createChatController(sessionType, chatDetails, options, websocketManager);

      if (sessionType === _constants__WEBPACK_IMPORTED_MODULE_3__["SESSION_TYPES"].AGENT) {
        return new AgentChatSession(chatController);
      } else if (sessionType === _constants__WEBPACK_IMPORTED_MODULE_3__["SESSION_TYPES"].CUSTOMER) {
        return new CustomerChatSession(chatController);
      } else {
        throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"]("Unkown value for session type, Allowed values are: " + Object.values(_constants__WEBPACK_IMPORTED_MODULE_3__["SESSION_TYPES"]), sessionType);
      }
    }
  }, {
    key: "_createChatController",
    value: function _createChatController(sessionType, chatDetailsInput, options, websocketManager) {
      var chatDetails = this.argsValidator.normalizeChatDetails(chatDetailsInput);
      var args = {
        sessionType: sessionType,
        chatDetails: chatDetails,
        chatClient: _client_client__WEBPACK_IMPORTED_MODULE_1__["ChatClientFactory"].getCachedClient(options),
        websocketManager: websocketManager
      };
      return new _chatController__WEBPACK_IMPORTED_MODULE_5__["ChatController"](args);
    }
  }]);

  return PersistentConnectionAndChatServiceSessionFactory;
}(ChatSessionFactory);

var ChatSession = /*#__PURE__*/function () {
  function ChatSession(controller) {
    _classCallCheck(this, ChatSession);

    this.controller = controller;
  }

  _createClass(ChatSession, [{
    key: "onMessage",
    value: function onMessage(callback) {
      this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_3__["CHAT_EVENTS"].INCOMING_MESSAGE, callback);
    }
  }, {
    key: "onTyping",
    value: function onTyping(callback) {
      this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_3__["CHAT_EVENTS"].INCOMING_TYPING, callback);
    }
  }, {
    key: "onConnectionBroken",
    value: function onConnectionBroken(callback) {
      this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_3__["CHAT_EVENTS"].CONNECTION_BROKEN, callback);
    }
  }, {
    key: "onConnectionEstablished",
    value: function onConnectionEstablished(callback) {
      this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_3__["CHAT_EVENTS"].CONNECTION_ESTABLISHED, callback);
    }
  }, {
    key: "onEnded",
    value: function onEnded(callback) {
      this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_3__["CHAT_EVENTS"].CHAT_ENDED, callback);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(args) {
      return this.controller.sendMessage(args);
    }
  }, {
    key: "sendAttachment",
    value: function sendAttachment(args) {
      return this.controller.sendAttachment(args);
    }
  }, {
    key: "downloadAttachment",
    value: function downloadAttachment(args) {
      return this.controller.downloadAttachment(args);
    }
  }, {
    key: "connect",
    value: function connect(args) {
      return this.controller.connect(args);
    }
  }, {
    key: "sendEvent",
    value: function sendEvent(args) {
      return this.controller.sendEvent(args);
    }
  }, {
    key: "getTranscript",
    value: function getTranscript(args) {
      return this.controller.getTranscript(args);
    }
  }, {
    key: "getChatDetails",
    value: function getChatDetails() {
      return this.controller.getChatDetails();
    }
  }]);

  return ChatSession;
}();

var AgentChatSession = /*#__PURE__*/function (_ChatSession) {
  _inherits(AgentChatSession, _ChatSession);

  var _super2 = _createSuper(AgentChatSession);

  function AgentChatSession(controller) {
    _classCallCheck(this, AgentChatSession);

    return _super2.call(this, controller);
  }

  _createClass(AgentChatSession, [{
    key: "cleanUpOnParticipantDisconnect",
    value: function cleanUpOnParticipantDisconnect() {
      return this.controller.cleanUpOnParticipantDisconnect();
    }
  }]);

  return AgentChatSession;
}(ChatSession);

var CustomerChatSession = /*#__PURE__*/function (_ChatSession2) {
  _inherits(CustomerChatSession, _ChatSession2);

  var _super3 = _createSuper(CustomerChatSession);

  function CustomerChatSession(controller) {
    _classCallCheck(this, CustomerChatSession);

    return _super3.call(this, controller);
  }

  _createClass(CustomerChatSession, [{
    key: "disconnectParticipant",
    value: function disconnectParticipant() {
      return this.controller.disconnectParticipant();
    }
  }]);

  return CustomerChatSession;
}(ChatSession);

var CHAT_SESSION_FACTORY = new PersistentConnectionAndChatServiceSessionFactory();

var setGlobalConfig = function setGlobalConfig(config) {
  var loggerConfig = config.loggerConfig;
  _globalConfig__WEBPACK_IMPORTED_MODULE_4__["GlobalConfig"].update(config);
  _log__WEBPACK_IMPORTED_MODULE_6__["LogManager"].updateLoggerConfig(loggerConfig);
};

var ChatSessionConstructor = function ChatSessionConstructor(args) {
  var options = args.options || {};
  var type = args.type || _constants__WEBPACK_IMPORTED_MODULE_3__["SESSION_TYPES"].AGENT;
  return CHAT_SESSION_FACTORY.createChatSession(type, args.chatDetails, options, args.websocketManager);
};

var ChatSessionObject = {
  create: ChatSessionConstructor,
  setGlobalConfig: setGlobalConfig,
  LogLevel: _log__WEBPACK_IMPORTED_MODULE_6__["LogLevel"],
  Logger: _log__WEBPACK_IMPORTED_MODULE_6__["Logger"],
  SessionTypes: _constants__WEBPACK_IMPORTED_MODULE_3__["SESSION_TYPES"]
};


/***/ }),

/***/ "./src/core/connectionHelpers/LpcConnectionHelper.js":
/*!***********************************************************!*\
  !*** ./src/core/connectionHelpers/LpcConnectionHelper.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../eventbus */ "./src/core/eventbus.js");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../log */ "./src/log.js");
/* harmony import */ var _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./baseConnectionHelper */ "./src/core/connectionHelpers/baseConnectionHelper.js");
/* harmony import */ var _lib_amazon_connect_websocket_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../lib/amazon-connect-websocket-manager */ "./src/lib/amazon-connect-websocket-manager.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../constants */ "./src/constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }








var LpcConnectionHelper = /*#__PURE__*/function (_BaseConnectionHelper) {
  _inherits(LpcConnectionHelper, _BaseConnectionHelper);

  var _super = _createSuper(LpcConnectionHelper);

  function LpcConnectionHelper(contactId, initialContactId, connectionDetailsProvider, websocketManager) {
    var _this;

    _classCallCheck(this, LpcConnectionHelper);

    _this = _super.call(this, connectionDetailsProvider);
    _this.cleanUpBaseInstance = !websocketManager;

    _this.tryCleanup();

    if (!LpcConnectionHelper.baseInstance) {
      LpcConnectionHelper.baseInstance = new LPCConnectionHelperBase(connectionDetailsProvider, websocketManager);
    }

    _this.contactId = contactId;
    _this.initialContactId = initialContactId;
    _this.status = null;
    _this.eventBus = new _eventbus__WEBPACK_IMPORTED_MODULE_0__["EventBus"]();
    _this.subscriptions = [LpcConnectionHelper.baseInstance.onEnded(_this.handleEnded.bind(_assertThisInitialized(_this))), LpcConnectionHelper.baseInstance.onConnectionGain(_this.handleConnectionGain.bind(_assertThisInitialized(_this))), LpcConnectionHelper.baseInstance.onConnectionLost(_this.handleConnectionLost.bind(_assertThisInitialized(_this))), LpcConnectionHelper.baseInstance.onMessage(_this.handleMessage.bind(_assertThisInitialized(_this)))];
    return _this;
  }

  _createClass(LpcConnectionHelper, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(LpcConnectionHelper.prototype), "start", this).call(this);

      return LpcConnectionHelper.baseInstance.start();
    }
  }, {
    key: "end",
    value: function end() {
      _get(_getPrototypeOf(LpcConnectionHelper.prototype), "end", this).call(this);

      this.eventBus.unsubscribeAll();
      this.subscriptions.forEach(function (f) {
        return f();
      });
      this.status = _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].Ended;
      this.tryCleanup();
    }
  }, {
    key: "tryCleanup",
    value: function tryCleanup() {
      if (LpcConnectionHelper.baseInstance && this.cleanUpBaseInstance) {
        LpcConnectionHelper.baseInstance.end();
        LpcConnectionHelper.baseInstance = null;
      }
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status || LpcConnectionHelper.baseInstance.getStatus();
    }
  }, {
    key: "onEnded",
    value: function onEnded(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].Ended, handler);
    }
  }, {
    key: "handleEnded",
    value: function handleEnded() {
      this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].Ended, {});
    }
  }, {
    key: "onConnectionGain",
    value: function onConnectionGain(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionGained, handler);
    }
  }, {
    key: "handleConnectionGain",
    value: function handleConnectionGain() {
      this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionGained, {});
    }
  }, {
    key: "onConnectionLost",
    value: function onConnectionLost(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionLost, handler);
    }
  }, {
    key: "handleConnectionLost",
    value: function handleConnectionLost() {
      this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionLost, {});
    }
  }, {
    key: "onMessage",
    value: function onMessage(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].IncomingMessage, handler);
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(message) {
      if (message.InitialContactId === this.initialContactId || message.ContactId === this.contactId) {
        this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].IncomingMessage, message);
      }
    }
  }]);

  return LpcConnectionHelper;
}(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["default"]);

LpcConnectionHelper.baseInstance = null;

var LPCConnectionHelperBase = /*#__PURE__*/function () {
  function LPCConnectionHelperBase(connectionDetailsProvider, websocketManager) {
    _classCallCheck(this, LPCConnectionHelperBase);

    this.status = _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].NeverStarted;
    this.eventBus = new _eventbus__WEBPACK_IMPORTED_MODULE_0__["EventBus"]();
    this.logger = _log__WEBPACK_IMPORTED_MODULE_1__["LogManager"].getLogger({
      prefix: "LPC WebSockets: "
    });
    this.initWebsocketManager(websocketManager, connectionDetailsProvider);
  }

  _createClass(LPCConnectionHelperBase, [{
    key: "initWebsocketManager",
    value: function initWebsocketManager(websocketManager, connectionDetailsProvider) {
      this.websocketManager = websocketManager || _lib_amazon_connect_websocket_manager__WEBPACK_IMPORTED_MODULE_3__["default"].create();
      this.websocketManager.subscribeTopics(["aws/chat"]);
      this.subscriptions = [this.websocketManager.onMessage("aws/chat", this.handleMessage.bind(this)), this.websocketManager.onConnectionGain(this.handleConnectionGain.bind(this)), this.websocketManager.onConnectionLost(this.handleConnectionLost.bind(this)), this.websocketManager.onInitFailure(this.handleEnded.bind(this))];

      if (!websocketManager) {
        this.websocketManager.init(function () {
          return connectionDetailsProvider.fetchConnectionDetails().then(function (connectionDetails) {
            return {
              webSocketTransport: {
                url: connectionDetails.url,
                expiry: connectionDetails.expiry,
                transportLifeTimeInSeconds: _constants__WEBPACK_IMPORTED_MODULE_4__["TRANSPORT_LIFETIME_IN_SECONDS"]
              }
            };
          });
        });
      }
    }
  }, {
    key: "end",
    value: function end() {
      this.websocketManager.closeWebSocket();
      this.eventBus.unsubscribeAll();
      this.subscriptions.forEach(function (f) {
        return f();
      });
    }
  }, {
    key: "start",
    value: function start() {
      if (this.status === _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].NeverStarted) {
        this.status = _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].Starting;
      }

      return Promise.resolve();
    }
  }, {
    key: "onEnded",
    value: function onEnded(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].Ended, handler);
    }
  }, {
    key: "handleEnded",
    value: function handleEnded() {
      this.status = _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].Ended;
      this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].Ended, {});
    }
  }, {
    key: "onConnectionGain",
    value: function onConnectionGain(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionGained, handler);
    }
  }, {
    key: "handleConnectionGain",
    value: function handleConnectionGain() {
      this.status = _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].Connected;
      this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionGained, {});
    }
  }, {
    key: "onConnectionLost",
    value: function onConnectionLost(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionLost, handler);
    }
  }, {
    key: "handleConnectionLost",
    value: function handleConnectionLost() {
      this.status = _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperStatus"].ConnectionLost;
      this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].ConnectionLost, {});
    }
  }, {
    key: "onMessage",
    value: function onMessage(handler) {
      return this.eventBus.subscribe(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].IncomingMessage, handler);
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(message) {
      var parsedMessage;

      try {
        parsedMessage = JSON.parse(message.content);
        this.eventBus.trigger(_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_2__["ConnectionHelperEvents"].IncomingMessage, parsedMessage);
      } catch (e) {
        this.logger.error("Wrong message format: ", message);
      }
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }]);

  return LPCConnectionHelperBase;
}();

/* harmony default export */ __webpack_exports__["default"] = (LpcConnectionHelper);

/***/ }),

/***/ "./src/core/connectionHelpers/baseConnectionHelper.js":
/*!************************************************************!*\
  !*** ./src/core/connectionHelpers/baseConnectionHelper.js ***!
  \************************************************************/
/*! exports provided: default, ConnectionHelperStatus, ConnectionHelperEvents, ConnectionInfoType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BaseConnectionHelper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionHelperStatus", function() { return ConnectionHelperStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionHelperEvents", function() { return ConnectionHelperEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionInfoType", function() { return ConnectionInfoType; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../constants */ "./src/constants.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var ConnectionHelperStatus = {
  NeverStarted: "NeverStarted",
  Starting: "Starting",
  Connected: "Connected",
  ConnectionLost: "ConnectionLost",
  Ended: "Ended"
};
var ConnectionHelperEvents = {
  ConnectionLost: "ConnectionLost",
  // event data is: {reason: ...}
  ConnectionGained: "ConnectionGained",
  // event data is: {reason: ...}
  Ended: "Ended",
  // event data is: {reason: ...}
  IncomingMessage: "IncomingMessage" // event data is: {payloadString: ...}

};
var ConnectionInfoType = {
  WEBSOCKET: "WEBSOCKET",
  CONNECTION_CREDENTIALS: "CONNECTION_CREDENTIALS"
};

var BaseConnectionHelper = /*#__PURE__*/function () {
  function BaseConnectionHelper(connectionDetailsProvider) {
    _classCallCheck(this, BaseConnectionHelper);

    this.connectionDetailsProvider = connectionDetailsProvider;
    this.isStarted = false;
  }

  _createClass(BaseConnectionHelper, [{
    key: "startConnectionTokenPolling",
    value: function startConnectionTokenPolling() {
      var _this = this;

      var isFirstCall = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var expiry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_TOKEN_POLLING_INTERVAL_IN_MS"];

      if (!isFirstCall) {
        this.connectionDetailsProvider.fetchConnectionToken().then(function () {
          expiry = _this.getTimeToConnectionTokenExpiry();
          _this.timeout = setTimeout(_this.startConnectionTokenPolling.bind(_this), expiry);
        })["catch"](function (e) {
          console.log("An error occurred when attempting to fetch the connection token during Connection Token Polling", e);
          _this.timeout = setTimeout(_this.startConnectionTokenPolling.bind(_this), expiry);
        });
      } else {
        this.timeout = setTimeout(this.startConnectionTokenPolling.bind(this), expiry);
      }
    }
  }, {
    key: "start",
    value: function start() {
      if (this.isStarted) {
        return;
      }

      this.isStarted = true;
      this.startConnectionTokenPolling(true, this.getTimeToConnectionTokenExpiry());
    }
  }, {
    key: "end",
    value: function end() {
      clearTimeout(this.timeout);
    }
  }, {
    key: "getConnectionToken",
    value: function getConnectionToken() {
      return this.connectionDetailsProvider.getFetchedConnectionToken();
    }
  }, {
    key: "getConnectionTokenExpiry",
    value: function getConnectionTokenExpiry() {
      return this.connectionDetailsProvider.getConnectionTokenExpiry();
    }
  }, {
    key: "getTimeToConnectionTokenExpiry",
    value: function getTimeToConnectionTokenExpiry() {
      var dateExpiry = new Date(this.getConnectionTokenExpiry()).getTime();
      var now = new Date().getTime();
      return dateExpiry - now - _constants__WEBPACK_IMPORTED_MODULE_0__["CONNECTION_TOKEN_EXPIRY_BUFFER_IN_MS"];
    }
  }]);

  return BaseConnectionHelper;
}();




/***/ }),

/***/ "./src/core/connectionHelpers/connectionDetailsProvider.js":
/*!*****************************************************************!*\
  !*** ./src/core/connectionHelpers/connectionDetailsProvider.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ConnectionDetailsProvider; });
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../exceptions */ "./src/core/exceptions.js");
/* harmony import */ var _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./baseConnectionHelper */ "./src/core/connectionHelpers/baseConnectionHelper.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants */ "./src/constants.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var ConnectionDetailsProvider = /*#__PURE__*/function () {
  function ConnectionDetailsProvider(participantToken, chatClient, sessionType) {
    var getConnectionToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, ConnectionDetailsProvider);

    this.chatClient = chatClient;
    this.participantToken = participantToken || null;
    this.connectionDetails = null;
    this.connectionToken = null;
    this.connectionTokenExpiry = null;
    this.sessionType = sessionType;
    this.getConnectionToken = getConnectionToken;
  }

  _createClass(ConnectionDetailsProvider, [{
    key: "getFetchedConnectionToken",
    value: function getFetchedConnectionToken() {
      return this.connectionToken;
    }
  }, {
    key: "getConnectionTokenExpiry",
    value: function getConnectionTokenExpiry() {
      return this.connectionTokenExpiry;
    }
  }, {
    key: "getConnectionDetails",
    value: function getConnectionDetails() {
      return this.connectionDetails;
    }
  }, {
    key: "fetchConnectionDetails",
    value: function fetchConnectionDetails() {
      var _this = this;

      return this._fetchConnectionDetails().then(function () {
        return _this.connectionDetails;
      });
    }
  }, {
    key: "fetchConnectionToken",
    value: function fetchConnectionToken() {
      var _this2 = this;

      return this._fetchConnectionDetails().then(function () {
        return _this2.connectionToken;
      });
    }
  }, {
    key: "_handleCreateParticipantConnectionResponse",
    value: function _handleCreateParticipantConnectionResponse(connectionDetails) {
      this.connectionDetails = {
        url: connectionDetails.Websocket.Url,
        expiry: connectionDetails.Websocket.ConnectionExpiry,
        transportLifeTimeInSeconds: _constants__WEBPACK_IMPORTED_MODULE_2__["TRANSPORT_LIFETIME_IN_SECONDS"]
      };
      this.connectionToken = connectionDetails.ConnectionCredentials.ConnectionToken;
      this.connectionTokenExpiry = connectionDetails.ConnectionCredentials.Expiry;
    }
  }, {
    key: "_handleGetConnectionTokenResponse",
    value: function _handleGetConnectionTokenResponse(connectionTokenDetails) {
      this.connectionDetails = {
        url: null,
        expiry: null
      };
      this.connectionToken = connectionTokenDetails.participantToken;
      this.connectionTokenExpiry = connectionTokenDetails.expiry;
    }
  }, {
    key: "_callCreateParticipantConnection",
    value: function _callCreateParticipantConnection() {
      var _this3 = this;

      return this.chatClient.createParticipantConnection(this.participantToken, [_baseConnectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionInfoType"].WEBSOCKET, _baseConnectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionInfoType"].CONNECTION_CREDENTIALS]).then(function (response) {
        return _this3._handleCreateParticipantConnectionResponse(response.data);
      })["catch"](function (error) {
        return Promise.reject({
          reason: "Failed to fetch connectionDetails with createParticipantConnection",
          _debug: error
        });
      });
    }
  }, {
    key: "_fetchConnectionDetails",
    value: function _fetchConnectionDetails() {
      var _this4 = this;

      // If this is a customer session, use the provided participantToken to call createParticipantConnection for our connection details. 
      if (this.sessionType === _constants__WEBPACK_IMPORTED_MODULE_2__["SESSION_TYPES"].CUSTOMER) {
        return this._callCreateParticipantConnection();
      } // If this is an agent session, we can't assume that the participantToken is valid. 
      // In this case, we use the getConnectionToken API to fetch a valid connectionToken and expiry. 
      // If that fails, for now we try with createParticipantConnection.
      else if (this.sessionType === _constants__WEBPACK_IMPORTED_MODULE_2__["SESSION_TYPES"].AGENT) {
          return this.getConnectionToken().then(function (response) {
            return _this4._handleGetConnectionTokenResponse(response.chatTokenTransport);
          })["catch"](function () {
            return _this4._callCreateParticipantConnection();
          });
        } else {
          return Promise.reject({
            reason: "Failed to fetch connectionDetails.",
            _debug: new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"]("Failed to fetch connectionDetails.")
          });
        }
    }
  }]);

  return ConnectionDetailsProvider;
}();



/***/ }),

/***/ "./src/core/eventbus.js":
/*!******************************!*\
  !*** ./src/core/eventbus.js ***!
  \******************************/
/*! exports provided: EventBus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventBus", function() { return EventBus; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");

var ALL_EVENTS = "<<all>>";
/**
 * An object representing an event subscription in an EventBus.
 */

var Subscription = function Subscription(subMap, eventName, f) {
  this.subMap = subMap;
  this.id = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].randomId();
  this.eventName = eventName;
  this.f = f;
};
/**
 * Unsubscribe the handler of this subscription from the EventBus
 * from which it was created.
 */


Subscription.prototype.unsubscribe = function () {
  this.subMap.unsubscribe(this.eventName, this.id);
};
/**
 * A map of event subscriptions, used by the EventBus.
 */


var SubscriptionMap = function SubscriptionMap() {
  this.subIdMap = {};
  this.subEventNameMap = {};
};
/**
 * Add a subscription for the named event.  Creates a new Subscription
 * object and returns it.  This object can be used to unsubscribe.
 */


SubscriptionMap.prototype.subscribe = function (eventName, f) {
  var sub = new Subscription(this, eventName, f);
  this.subIdMap[sub.id] = sub;
  var subList = this.subEventNameMap[eventName] || [];
  subList.push(sub);
  this.subEventNameMap[eventName] = subList;
  return function () {
    return sub.unsubscribe();
  };
};
/**
 * Unsubscribe a subscription matching the given event name and id.
 */


SubscriptionMap.prototype.unsubscribe = function (eventName, subId) {
  if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].contains(this.subEventNameMap, eventName)) {
    this.subEventNameMap[eventName] = this.subEventNameMap[eventName].filter(function (s) {
      return s.id !== subId;
    });

    if (this.subEventNameMap[eventName].length < 1) {
      delete this.subEventNameMap[eventName];
    }
  }

  if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].contains(this.subIdMap, subId)) {
    delete this.subIdMap[subId];
  }
};
/**
 * Get a list of all subscriptions in the subscription map.
 */


SubscriptionMap.prototype.getAllSubscriptions = function () {
  return _utils__WEBPACK_IMPORTED_MODULE_0__["default"].values(this.subEventNameMap).reduce(function (a, b) {
    return a.concat(b);
  }, []);
};
/**
 * Get a list of subscriptions for the given event name, or an empty
 * list if there are no subscriptions.
 */


SubscriptionMap.prototype.getSubscriptions = function (eventName) {
  return this.subEventNameMap[eventName] || [];
};
/**
 * An object which maintains a map of subscriptions and serves as the
 * mechanism for triggering events to be handled by subscribers.
 */


var EventBus = function EventBus(paramsIn) {
  var params = paramsIn || {};
  this.subMap = new SubscriptionMap();
  this.logEvents = params.logEvents || false;
};
/**
 * Subscribe to the named event.  Returns a new Subscription object
 * which can be used to unsubscribe.
 */


EventBus.prototype.subscribe = function (eventName, f) {
  _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(eventName, "eventName");
  _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(f, "f");
  _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertTrue(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(f), "f must be a function");
  return this.subMap.subscribe(eventName, f);
};
/**
 * Subscribe a function to be called on all events.
 */


EventBus.prototype.subscribeAll = function (f) {
  _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(f, "f");
  _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertTrue(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(f), "f must be a function");
  return this.subMap.subscribe(ALL_EVENTS, f);
};
/**
 * Get a list of subscriptions for the given event name, or an empty
 * list if there are no subscriptions.
 */


EventBus.prototype.getSubscriptions = function (eventName) {
  return this.subMap.getSubscriptions(eventName);
};
/**
 * Trigger the given event with the given data.  All methods subscribed
 * to this event will be called and are provided with the given arbitrary
 * data object and the name of the event, in that order.
 */


EventBus.prototype.trigger = function (eventName, data) {
  _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(eventName, "eventName");
  var self = this;
  var allEventSubs = this.subMap.getSubscriptions(ALL_EVENTS);
  var eventSubs = this.subMap.getSubscriptions(eventName); // if (this.logEvents && (eventName !== connect.EventType.LOG && eventName !== connect.EventType.MASTER_RESPONSE && eventName !== connect.EventType.API_METRIC)) {
  //    connect.getLog().trace("Publishing event: %s", eventName);
  // }

  allEventSubs.concat(eventSubs).forEach(function (sub) {
    try {
      sub.f(data || null, eventName, self);
    } catch (e) {//   connect
      //     .getLog()
      //     .error("'%s' event handler failed.", eventName)
      //     .withException(e);
    }
  });
};
/**
 * Trigger the given event with the given data.  All methods subscribed
 * to this event will be called and are provided with the given arbitrary
 * data object and the name of the event, in that order.
 */


EventBus.prototype.triggerAsync = function (eventName, data) {
  var _this = this;

  setTimeout(function () {
    return _this.trigger(eventName, data);
  }, 0);
};
/**
 * Returns a closure which bridges an event from another EventBus to this bus.
 *
 * Usage:
 * conduit.onUpstream("MyEvent", bus.bridge());
 */


EventBus.prototype.bridge = function () {
  var self = this;
  return function (data, event) {
    self.trigger(event, data);
  };
};
/**
 * Unsubscribe all events in the event bus.
 */


EventBus.prototype.unsubscribeAll = function () {
  this.subMap.getAllSubscriptions().forEach(function (sub) {
    sub.unsubscribe();
  });
};



/***/ }),

/***/ "./src/core/exceptions.js":
/*!********************************!*\
  !*** ./src/core/exceptions.js ***!
  \********************************/
/*! exports provided: UnImplementedMethodException, IllegalArgumentException, IllegalStateException, IllegalJsonException, ValueError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnImplementedMethodException", function() { return UnImplementedMethodException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalArgumentException", function() { return IllegalArgumentException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalStateException", function() { return IllegalStateException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalJsonException", function() { return IllegalJsonException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValueError", function() { return ValueError; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ValueError = /*#__PURE__*/function (_Error) {
  _inherits(ValueError, _Error);

  var _super = _createSuper(ValueError);

  function ValueError(message) {
    var _this;

    _classCallCheck(this, ValueError);

    _this = _super.call(this, message);
    _this.name = "ValueError";
    console.log("EXCEPTION: " + _this.name + " MESSAGE: " + _this.message);
    return _this;
  }

  return ValueError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var UnImplementedMethodException = /*#__PURE__*/function (_Error2) {
  _inherits(UnImplementedMethodException, _Error2);

  var _super2 = _createSuper(UnImplementedMethodException);

  function UnImplementedMethodException(message) {
    var _this2;

    _classCallCheck(this, UnImplementedMethodException);

    _this2 = _super2.call(this, message);
    _this2.name = "UnImplementedMethod";
    console.log("EXCEPTION: " + _this2.name + " MESSAGE: " + _this2.message);
    return _this2;
  }

  return UnImplementedMethodException;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var IllegalArgumentException = /*#__PURE__*/function (_Error3) {
  _inherits(IllegalArgumentException, _Error3);

  var _super3 = _createSuper(IllegalArgumentException);

  function IllegalArgumentException(message, argument) {
    var _this3;

    _classCallCheck(this, IllegalArgumentException);

    _this3 = _super3.call(this, message);
    _this3.name = "IllegalArgument";
    _this3.argument = argument;
    console.log("EXCEPTION: " + _this3.name + " MESSAGE: " + _this3.message);
    return _this3;
  }

  return IllegalArgumentException;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var IllegalStateException = /*#__PURE__*/function (_Error4) {
  _inherits(IllegalStateException, _Error4);

  var _super4 = _createSuper(IllegalStateException);

  function IllegalStateException(message) {
    var _this4;

    _classCallCheck(this, IllegalStateException);

    _this4 = _super4.call(this, message);
    _this4.name = "IllegalState";
    console.log("EXCEPTION: " + _this4.name + " MESSAGE: " + _this4.message);
    return _this4;
  }

  return IllegalStateException;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var IllegalJsonException = /*#__PURE__*/function (_Error5) {
  _inherits(IllegalJsonException, _Error5);

  var _super5 = _createSuper(IllegalJsonException);

  function IllegalJsonException(message, args) {
    var _this5;

    _classCallCheck(this, IllegalJsonException);

    _this5 = _super5.call(this, message);
    _this5.name = "IllegalState";
    _this5.causeException = args.causeException;
    _this5.originalJsonString = args.originalJsonString;
    console.log("EXCEPTION: " + _this5.name + " MESSAGE: " + _this5.message + " cause: " + _this5.causeException);
    return _this5;
  }

  return IllegalJsonException;
}( /*#__PURE__*/_wrapNativeSuper(Error));



/***/ }),

/***/ "./src/globalConfig.js":
/*!*****************************!*\
  !*** ./src/globalConfig.js ***!
  \*****************************/
/*! exports provided: GlobalConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalConfig", function() { return GlobalConfig; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GlobalConfigImpl = /*#__PURE__*/function () {
  function GlobalConfigImpl() {
    _classCallCheck(this, GlobalConfigImpl);
  }

  _createClass(GlobalConfigImpl, [{
    key: "update",
    value: function update(configInput) {
      var config = configInput || {};
      this.region = config.region || this.region;
      this.endpointOverride = config.endpoint || this.endpointOverride;
      this.reconnect = config.reconnect === false ? false : true;
    }
  }, {
    key: "getRegion",
    value: function getRegion() {
      return this.region;
    }
  }, {
    key: "getEndpointOverride",
    value: function getEndpointOverride() {
      return this.endpointOverride;
    }
  }]);

  return GlobalConfigImpl;
}();

var GlobalConfig = new GlobalConfigImpl();


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: ChatSession */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatSession", function() { return ChatSession; });
/* harmony import */ var _core_chatSession__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/chatSession */ "./src/core/chatSession.js");
/*eslint no-unused-vars: "off"*/

global.connect = global.connect || {};
connect.ChatSession = _core_chatSession__WEBPACK_IMPORTED_MODULE_0__["ChatSessionObject"];
var ChatSession = _core_chatSession__WEBPACK_IMPORTED_MODULE_0__["ChatSessionObject"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/lib/amazon-connect-websocket-manager.js":
/*!*****************************************************!*\
  !*** ./src/lib/amazon-connect-websocket-manager.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

global.connect = global.connect || {};
var currentWebsocketManager = connect.WebSocketManager;
!function (e) {
  var n = {};

  function t(o) {
    if (n[o]) return n[o].exports;
    var r = n[o] = {
      i: o,
      l: !1,
      exports: {}
    };
    return e[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
  }

  t.m = e, t.c = n, t.d = function (e, n, o) {
    t.o(e, n) || Object.defineProperty(e, n, {
      enumerable: !0,
      get: o
    });
  }, t.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, t.t = function (e, n) {
    if (1 & n && (e = t(e)), 8 & n) return e;
    if (4 & n && "object" == _typeof(e) && e && e.__esModule) return e;
    var o = Object.create(null);
    if (t.r(o), Object.defineProperty(o, "default", {
      enumerable: !0,
      value: e
    }), 2 & n && "string" != typeof e) for (var r in e) {
      t.d(o, r, function (n) {
        return e[n];
      }.bind(null, r));
    }
    return o;
  }, t.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e["default"];
    } : function () {
      return e;
    };
    return t.d(n, "a", n), n;
  }, t.o = function (e, n) {
    return Object.prototype.hasOwnProperty.call(e, n);
  }, t.p = "", t(t.s = 2);
}([function (e, n, t) {
  "use strict";

  var o = t(1),
      r = "NULL",
      i = "CLIENT_LOGGER",
      c = "DEBUG",
      s = 2e3,
      a = "aws/subscribe",
      u = "aws/unsubscribe",
      l = "aws/heartbeat",
      f = "connected",
      p = "disconnected";

  function d(e) {
    return (d = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
    })(e);
  }

  var b = {
    assertTrue: function assertTrue(e, n) {
      if (!e) throw new Error(n);
    },
    assertNotNull: function assertNotNull(e, n) {
      return b.assertTrue(null !== e && void 0 !== d(e), Object(o.sprintf)("%s must be provided", n || "A value")), e;
    },
    isNonEmptyString: function isNonEmptyString(e) {
      return "string" == typeof e && e.length > 0;
    },
    assertIsList: function assertIsList(e, n) {
      if (!Array.isArray(e)) throw new Error(n + " is not an array");
    },
    isFunction: function isFunction(e) {
      return !!(e && e.constructor && e.call && e.apply);
    },
    isObject: function isObject(e) {
      return !("object" !== d(e) || null === e);
    },
    isString: function isString(e) {
      return "string" == typeof e;
    },
    isNumber: function isNumber(e) {
      return "number" == typeof e;
    }
  },
      g = new RegExp("^(wss://)\\w*");
  b.validWSUrl = function (e) {
    return g.test(e);
  }, b.getSubscriptionResponse = function (e, n, t) {
    return {
      topic: e,
      content: {
        status: n ? "success" : "failure",
        topics: t
      }
    };
  }, b.assertIsObject = function (e, n) {
    if (!b.isObject(e)) throw new Error(n + " is not an object!");
  }, b.addJitter = function (e) {
    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
    n = Math.min(n, 1);
    var t = Math.random() > .5 ? 1 : -1;
    return Math.floor(e + t * e * Math.random() * n);
  }, b.isNetworkOnline = function () {
    return navigator.onLine;
  }, b.isNetworkFailure = function (e) {
    return !(!e._debug || !e._debug.type) && "NetworkingError" === e._debug.type;
  };
  var m = b;

  function y(e) {
    return (y = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
    })(e);
  }

  function S(e, n) {
    return !n || "object" !== y(n) && "function" != typeof n ? function (e) {
      if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return e;
    }(e) : n;
  }

  function h(e) {
    return (h = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
      return e.__proto__ || Object.getPrototypeOf(e);
    })(e);
  }

  function k(e, n) {
    return (k = Object.setPrototypeOf || function (e, n) {
      return e.__proto__ = n, e;
    })(e, n);
  }

  function v(e, n) {
    if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
  }

  function w(e, n) {
    for (var t = 0; t < n.length; t++) {
      var o = n[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
    }
  }

  function C(e, n, t) {
    return n && w(e.prototype, n), t && w(e, t), e;
  }

  var T = function () {
    function e() {
      v(this, e);
    }

    return C(e, [{
      key: "debug",
      value: function value(e) {}
    }, {
      key: "info",
      value: function value(e) {}
    }, {
      key: "warn",
      value: function value(e) {}
    }, {
      key: "error",
      value: function value(e) {}
    }]), e;
  }(),
      O = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40
  },
      I = function () {
    function e() {
      v(this, e), this.updateLoggerConfig(), this.consoleLoggerWrapper = _();
    }

    return C(e, [{
      key: "writeToClientLogger",
      value: function value(e, n) {
        if (this.hasClientLogger()) switch (e) {
          case O.DEBUG:
            return this._clientLogger.debug(n);

          case O.INFO:
            return this._clientLogger.info(n);

          case O.WARN:
            return this._clientLogger.warn(n);

          case O.ERROR:
            return this._clientLogger.error(n);
        }
      }
    }, {
      key: "isLevelEnabled",
      value: function value(e) {
        return e >= this._level;
      }
    }, {
      key: "hasClientLogger",
      value: function value() {
        return null !== this._clientLogger;
      }
    }, {
      key: "getLogger",
      value: function value(e) {
        var n = e.prefix || "";
        return this._logsDestination === c ? this.consoleLoggerWrapper : new N(n);
      }
    }, {
      key: "updateLoggerConfig",
      value: function value(e) {
        var n = e || {};
        this._level = n.level || O.DEBUG, this._clientLogger = n.logger || null, this._logsDestination = r, n.debug && (this._logsDestination = c), n.logger && (this._logsDestination = i);
      }
    }]), e;
  }(),
      W = function () {
    function e() {
      v(this, e);
    }

    return C(e, [{
      key: "debug",
      value: function value() {}
    }, {
      key: "info",
      value: function value() {}
    }, {
      key: "warn",
      value: function value() {}
    }, {
      key: "error",
      value: function value() {}
    }]), e;
  }(),
      N = function (e) {
    function n(e) {
      var t;
      return v(this, n), (t = S(this, h(n).call(this))).prefix = e || "", t;
    }

    return function (e, n) {
      if ("function" != typeof n && null !== n) throw new TypeError("Super expression must either be null or a function");
      e.prototype = Object.create(n && n.prototype, {
        constructor: {
          value: e,
          writable: !0,
          configurable: !0
        }
      }), n && k(e, n);
    }(n, W), C(n, [{
      key: "debug",
      value: function value() {
        for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) {
          n[t] = arguments[t];
        }

        return this._log(O.DEBUG, n);
      }
    }, {
      key: "info",
      value: function value() {
        for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) {
          n[t] = arguments[t];
        }

        return this._log(O.INFO, n);
      }
    }, {
      key: "warn",
      value: function value() {
        for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) {
          n[t] = arguments[t];
        }

        return this._log(O.WARN, n);
      }
    }, {
      key: "error",
      value: function value() {
        for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++) {
          n[t] = arguments[t];
        }

        return this._log(O.ERROR, n);
      }
    }, {
      key: "_shouldLog",
      value: function value(e) {
        return E.hasClientLogger() && E.isLevelEnabled(e);
      }
    }, {
      key: "_writeToClientLogger",
      value: function value(e, n) {
        return E.writeToClientLogger(e, n);
      }
    }, {
      key: "_log",
      value: function value(e, n) {
        if (this._shouldLog(e)) {
          var t = this._convertToSingleStatement(n);

          return this._writeToClientLogger(e, t);
        }
      }
    }, {
      key: "_convertToSingleStatement",
      value: function value(e) {
        var n = "";
        this.prefix && (n += this.prefix + " ");

        for (var t = 0; t < e.length; t++) {
          var o = e[t];
          n += this._convertToString(o) + " ";
        }

        return n;
      }
    }, {
      key: "_convertToString",
      value: function value(e) {
        try {
          if (!e) return "";
          if (m.isString(e)) return e;

          if (m.isObject(e) && m.isFunction(e.toString)) {
            var n = e.toString();
            if ("[object Object]" !== n) return n;
          }

          return JSON.stringify(e);
        } catch (n) {
          return console.error("Error while converting argument to string", e, n), "";
        }
      }
    }]), n;
  }(),
      _ = function _() {
    var e = new W();
    return e.debug = console.debug, e.info = console.info, e.warn = console.warn, e.error = console.error, e;
  },
      E = new I();

  function L(e, n) {
    for (var t = 0; t < n.length; t++) {
      var o = n[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
    }
  }

  var F = function () {
    function e(n) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : s;
      !function (e, n) {
        if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
      }(this, e), this.numAttempts = 0, this.executor = n, this.hasActiveReconnection = !1, this.defaultRetry = t;
    }

    var n, t, o;
    return n = e, (t = [{
      key: "retry",
      value: function value() {
        var e = this;
        this.hasActiveReconnection || (this.hasActiveReconnection = !0, setTimeout(function () {
          e._execute();
        }, this._getDelay()));
      }
    }, {
      key: "_execute",
      value: function value() {
        this.hasActiveReconnection = !1, this.executor(), this.numAttempts++;
      }
    }, {
      key: "connected",
      value: function value() {
        this.numAttempts = 0;
      }
    }, {
      key: "_getDelay",
      value: function value() {
        var e = Math.pow(2, this.numAttempts) * this.defaultRetry;
        return e <= 3e4 ? e : 3e4;
      }
    }]) && L(n.prototype, t), o && L(n, o), e;
  }();

  t.d(n, "a", function () {
    return R;
  });

  var x = function x() {
    var e = E.getLogger({}),
        n = m.isNetworkOnline(),
        t = {
      primary: null,
      secondary: null
    },
        o = {
      reconnectWebSocket: !0,
      websocketInitFailed: !1,
      exponentialBackOffTime: 1e3,
      exponentialTimeoutHandle: null,
      lifeTimeTimeoutHandle: null,
      webSocketInitCheckerTimeoutId: null,
      connState: null
    },
        r = {
      connectWebSocketRetryCount: 0,
      connectionAttemptStartTime: null,
      noOpenConnectionsTimestamp: null
    },
        i = {
      pendingResponse: !1,
      intervalHandle: null
    },
        c = {
      initFailure: new Set(),
      getWebSocketTransport: null,
      subscriptionUpdate: new Set(),
      subscriptionFailure: new Set(),
      topic: new Map(),
      allMessage: new Set(),
      connectionGain: new Set(),
      connectionLost: new Set(),
      connectionOpen: new Set(),
      connectionClose: new Set()
    },
        s = {
      connConfig: null,
      promiseHandle: null,
      promiseCompleted: !0
    },
        d = {
      subscribed: new Set(),
      pending: new Set(),
      subscriptionHistory: new Set()
    },
        b = {
      responseCheckIntervalId: null,
      requestCompleted: !0,
      reSubscribeIntervalId: null,
      consecutiveFailedSubscribeAttempts: 0,
      consecutiveNoResponseRequest: 0
    },
        g = new F(function () {
      U();
    }),
        y = new Set([a, u, l]),
        S = setInterval(function () {
      if (n !== m.isNetworkOnline()) {
        if (!(n = m.isNetworkOnline())) return void J(e.info("Network offline"));
        var t = O();
        n && (!t || w(t, WebSocket.CLOSING) || w(t, WebSocket.CLOSED)) && (J(e.info("Network online, connecting to WebSocket server")), U());
      }
    }, 250),
        h = function h(n, t) {
      n.forEach(function (n) {
        try {
          n(t);
        } catch (n) {
          J(e.error("Error executing callback", n));
        }
      });
    },
        k = function k(e) {
      if (null === e) return "NULL";

      switch (e.readyState) {
        case WebSocket.CONNECTING:
          return "CONNECTING";

        case WebSocket.OPEN:
          return "OPEN";

        case WebSocket.CLOSING:
          return "CLOSING";

        case WebSocket.CLOSED:
          return "CLOSED";

        default:
          return "UNDEFINED";
      }
    },
        v = function v() {
      var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
      J(e.debug("[" + n + "] Primary WebSocket: " + k(t.primary) + " | Secondary WebSocket: " + k(t.secondary)));
    },
        w = function w(e, n) {
      return e && e.readyState === n;
    },
        C = function C(e) {
      return w(e, WebSocket.OPEN);
    },
        T = function T(e) {
      return null === e || void 0 === e.readyState || w(e, WebSocket.CLOSED);
    },
        O = function O() {
      return null !== t.secondary ? t.secondary : t.primary;
    },
        I = function I() {
      return C(O());
    },
        W = function W() {
      if (i.pendingResponse) return J(e.warn("Heartbeat response not received")), clearInterval(i.intervalHandle), i.pendingResponse = !1, void U();
      I() ? (J(e.debug("Sending heartbeat")), O().send(G(l)), i.pendingResponse = !0) : (J(e.warn("Failed to send heartbeat since WebSocket is not open")), v("sendHeartBeat"), U());
    },
        N = function N() {
      o.exponentialBackOffTime = 1e3, i.pendingResponse = !1, o.reconnectWebSocket = !0, clearTimeout(o.lifeTimeTimeoutHandle), clearInterval(i.intervalHandle), clearTimeout(o.exponentialTimeoutHandle), clearTimeout(o.webSocketInitCheckerTimeoutId);
    },
        _ = function _() {
      b.consecutiveFailedSubscribeAttempts = 0, b.consecutiveNoResponseRequest = 0, clearInterval(b.responseCheckIntervalId), clearInterval(b.reSubscribeIntervalId);
    },
        L = function L() {
      r.connectWebSocketRetryCount = 0, r.connectionAttemptStartTime = null, r.noOpenConnectionsTimestamp = null;
    },
        x = function x() {
      try {
        J(e.info("WebSocket connection established!")), v("webSocketOnOpen"), null !== o.connState && o.connState !== p || h(c.connectionGain), o.connState = f;
        var n = Date.now();
        h(c.connectionOpen, {
          connectWebSocketRetryCount: r.connectWebSocketRetryCount,
          connectionAttemptStartTime: r.connectionAttemptStartTime,
          noOpenConnectionsTimestamp: r.noOpenConnectionsTimestamp,
          connectionEstablishedTime: n,
          timeToConnect: n - r.connectionAttemptStartTime,
          timeWithoutConnection: r.noOpenConnectionsTimestamp ? n - r.noOpenConnectionsTimestamp : null
        }), L(), N(), O().openTimestamp = Date.now(), 0 === d.subscribed.size && C(t.secondary) && M(t.primary, "[Primary WebSocket] Closing WebSocket"), (d.subscribed.size > 0 || d.pending.size > 0) && (C(t.secondary) && J(e.info("Subscribing secondary websocket to topics of primary websocket")), d.subscribed.forEach(function (e) {
          d.subscriptionHistory.add(e), d.pending.add(e);
        }), d.subscribed.clear(), A()), W(), i.intervalHandle = setInterval(W, 1e4);
        var a = Math.min(m.addJitter(3e6, .1), 1e3 * s.connConfig.webSocketTransport.transportLifeTimeInSeconds);
        J(e.debug("Scheduling WebSocket manager reconnection, after delay " + a + " ms")), o.lifeTimeTimeoutHandle = setTimeout(function () {
          J(e.debug("Starting scheduled WebSocket manager reconnection")), U();
        }, a);
      } catch (n) {
        J(e.error("Error after establishing WebSocket connection", n));
      }
    },
        R = function R(n) {
      v("webSocketOnError"), J(e.error("WebSocketManager Error, error_event: ", JSON.stringify(n))), U();
    },
        j = function j(n) {
      var o = JSON.parse(n.data);

      switch (o.topic) {
        case a:
          if (J(e.debug("Subscription Message received from webSocket server", n.data)), b.requestCompleted = !0, b.consecutiveNoResponseRequest = 0, "success" === o.content.status) b.consecutiveFailedSubscribeAttempts = 0, o.content.topics.forEach(function (e) {
            d.subscriptionHistory["delete"](e), d.pending["delete"](e), d.subscribed.add(e);
          }), 0 === d.subscriptionHistory.size ? C(t.secondary) && (J(e.info("Successfully subscribed secondary websocket to all topics of primary websocket")), M(t.primary, "[Primary WebSocket] Closing WebSocket")) : A(), h(c.subscriptionUpdate, o);else {
            if (clearInterval(b.reSubscribeIntervalId), ++b.consecutiveFailedSubscribeAttempts, 5 === b.consecutiveFailedSubscribeAttempts) return h(c.subscriptionFailure, o), void (b.consecutiveFailedSubscribeAttempts = 0);
            b.reSubscribeIntervalId = setInterval(function () {
              A();
            }, 500);
          }
          break;

        case l:
          J(e.debug("Heartbeat response received")), i.pendingResponse = !1;
          break;

        default:
          if (o.topic) {
            if (J(e.debug("Message received for topic " + o.topic)), C(t.primary) && C(t.secondary) && 0 === d.subscriptionHistory.size && this === t.primary) return void J(e.warn("Ignoring Message for Topic " + o.topic + ", to avoid duplicates"));
            if (0 === c.allMessage.size && 0 === c.topic.size) return void J(e.warn("No registered callback listener for Topic", o.topic));
            h(c.allMessage, o), c.topic.has(o.topic) && h(c.topic.get(o.topic), o);
          } else o.message ? J(e.warn("WebSocketManager Message Error", o)) : J(e.warn("Invalid incoming message", o));

      }
    },
        A = function n() {
      if (b.consecutiveNoResponseRequest > 3) return J(e.warn("Ignoring subscribePendingTopics since we have exhausted max subscription retries with no response")), void h(c.subscriptionFailure, m.getSubscriptionResponse(a, !1, Array.from(d.pending)));
      I() ? (clearInterval(b.responseCheckIntervalId), O().send(G(a, {
        topics: Array.from(d.pending)
      })), b.requestCompleted = !1, b.responseCheckIntervalId = setInterval(function () {
        b.requestCompleted || (++b.consecutiveNoResponseRequest, n());
      }, 1e3)) : J(e.warn("Ignoring subscribePendingTopics call since Default WebSocket is not open"));
    },
        M = function M(n, t) {
      w(n, WebSocket.CONNECTING) || w(n, WebSocket.OPEN) ? n.close(1e3, t) : J(e.warn("Ignoring WebSocket Close request, WebSocket State: " + k(n)));
    },
        D = function D(e) {
      M(t.primary, "[Primary] WebSocket " + e), M(t.secondary, "[Secondary] WebSocket " + e);
    },
        P = function P() {
      r.connectWebSocketRetryCount++;
      var n = m.addJitter(o.exponentialBackOffTime, .3);
      Date.now() + n <= s.connConfig.urlConnValidTime ? (J(e.debug("Scheduling WebSocket reinitialization, after delay " + n + " ms")), o.exponentialTimeoutHandle = setTimeout(function () {
        return q();
      }, n), o.exponentialBackOffTime *= 2) : (J(e.warn("WebSocket URL cannot be used to establish connection")), U());
    },
        H = function H(n) {
      N(), _(), J(e.error("WebSocket Initialization failed")), o.websocketInitFailed = !0, D("Terminating WebSocket Manager"), clearInterval(S), h(c.initFailure, {
        connectWebSocketRetryCount: r.connectWebSocketRetryCount,
        connectionAttemptStartTime: r.connectionAttemptStartTime,
        reason: n
      }), L();
    },
        G = function G(e, n) {
      return JSON.stringify({
        topic: e,
        content: n
      });
    },
        z = function z(n) {
      return !!(m.isObject(n) && m.isObject(n.webSocketTransport) && m.isNonEmptyString(n.webSocketTransport.url) && m.validWSUrl(n.webSocketTransport.url) && 1e3 * n.webSocketTransport.transportLifeTimeInSeconds >= 3e5) || (J(e.error("Invalid WebSocket Connection Configuration", n)), !1);
    },
        U = function U() {
      if (m.isNetworkOnline()) {
        if (o.websocketInitFailed) J(e.debug("WebSocket Init had failed, ignoring this getWebSocketConnConfig request"));else {
          if (s.promiseCompleted) return N(), J(e.info("Fetching new WebSocket connection configuration")), r.connectionAttemptStartTime = r.connectionAttemptStartTime || Date.now(), s.promiseCompleted = !1, s.promiseHandle = c.getWebSocketTransport(), s.promiseHandle.then(function (n) {
            return s.promiseCompleted = !0, J(e.debug("Successfully fetched webSocket connection configuration", n)), z(n) ? (s.connConfig = n, s.connConfig.urlConnValidTime = Date.now() + 85e3, g.connected(), q()) : (H("Invalid WebSocket connection configuration: " + n), {
              webSocketConnectionFailed: !0
            });
          }, function (n) {
            return s.promiseCompleted = !0, J(e.error("Failed to fetch webSocket connection configuration", n)), m.isNetworkFailure(n) && (J(e.info("Retrying fetching new WebSocket connection configuration")), g.retry()), {
              webSocketConnectionFailed: !0
            };
          });
          J(e.debug("There is an ongoing getWebSocketConnConfig request, this request will be ignored"));
        }
      } else J(e.info("Network offline, ignoring this getWebSocketConnConfig request"));
    },
        q = function q() {
      if (o.websocketInitFailed) return J(e.info("web-socket initializing had failed, aborting re-init")), {
        webSocketConnectionFailed: !0
      };
      if (!m.isNetworkOnline()) return J(e.warn("System is offline aborting web-socket init")), {
        webSocketConnectionFailed: !0
      };
      J(e.info("Initializing Websocket Manager")), v("initWebSocket");

      try {
        if (z(s.connConfig)) {
          var n = null;
          return C(t.primary) ? (J(e.debug("Primary Socket connection is already open")), w(t.secondary, WebSocket.CONNECTING) || (J(e.debug("Establishing a secondary web-socket connection")), t.secondary = B()), n = t.secondary) : (w(t.primary, WebSocket.CONNECTING) || (J(e.debug("Establishing a primary web-socket connection")), t.primary = B()), n = t.primary), o.webSocketInitCheckerTimeoutId = setTimeout(function () {
            C(n) || P();
          }, 1e3), {
            webSocketConnectionFailed: !1
          };
        }
      } catch (n) {
        return J(e.error("Error Initializing web-socket-manager", n)), H("Failed to initialize new WebSocket: " + n.message), {
          webSocketConnectionFailed: !0
        };
      }
    },
        B = function B() {
      var n = new WebSocket(s.connConfig.webSocketTransport.url);
      return n.addEventListener("open", x), n.addEventListener("message", j), n.addEventListener("error", R), n.addEventListener("close", function (i) {
        return function (n, i) {
          J(e.info("Socket connection is closed", n)), v("webSocketOnClose before-cleanup"), h(c.connectionClose, {
            openTimestamp: i.openTimestamp,
            closeTimestamp: Date.now(),
            connectionDuration: Date.now() - i.openTimestamp,
            code: n.code,
            reason: n.reason
          }), T(t.primary) && (t.primary = null), T(t.secondary) && (t.secondary = null), o.reconnectWebSocket && (C(t.primary) || C(t.secondary) ? T(t.primary) && C(t.secondary) && (J(e.info("[Primary] WebSocket Cleanly Closed")), t.primary = t.secondary, t.secondary = null) : (J(e.warn("Neither primary websocket and nor secondary websocket have open connections, attempting to re-establish connection")), o.connState === p ? J(e.info("Ignoring connectionLost callback invocation")) : (h(c.connectionLost, {
            openTimestamp: i.openTimestamp,
            closeTimestamp: Date.now(),
            connectionDuration: Date.now() - i.openTimestamp,
            code: n.code,
            reason: n.reason
          }), r.noOpenConnectionsTimestamp = Date.now()), o.connState = p, U()), v("webSocketOnClose after-cleanup"));
        }(i, n);
      }), n;
    },
        J = function J(e) {
      return e && "function" == typeof e.sendInternalLogToServer && e.sendInternalLogToServer(), e;
    };

    this.init = function (n) {
      if (m.assertTrue(m.isFunction(n), "transportHandle must be a function"), null === c.getWebSocketTransport) return c.getWebSocketTransport = n, U();
      J(e.warn("Web Socket Manager was already initialized"));
    }, this.onInitFailure = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.initFailure.add(e), o.websocketInitFailed && e(), function () {
        return c.initFailure["delete"](e);
      };
    }, this.onConnectionOpen = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.connectionOpen.add(e), function () {
        return c.connectionOpen["delete"](e);
      };
    }, this.onConnectionClose = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.connectionClose.add(e), function () {
        return c.connectionClose["delete"](e);
      };
    }, this.onConnectionGain = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.connectionGain.add(e), I() && e(), function () {
        return c.connectionGain["delete"](e);
      };
    }, this.onConnectionLost = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.connectionLost.add(e), o.connState === p && e(), function () {
        return c.connectionLost["delete"](e);
      };
    }, this.onSubscriptionUpdate = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.subscriptionUpdate.add(e), function () {
        return c.subscriptionUpdate["delete"](e);
      };
    }, this.onSubscriptionFailure = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.subscriptionFailure.add(e), function () {
        return c.subscriptionFailure["delete"](e);
      };
    }, this.onMessage = function (e, n) {
      return m.assertNotNull(e, "topicName"), m.assertTrue(m.isFunction(n), "cb must be a function"), c.topic.has(e) ? c.topic.get(e).add(n) : c.topic.set(e, new Set([n])), function () {
        return c.topic.get(e)["delete"](n);
      };
    }, this.onAllMessage = function (e) {
      return m.assertTrue(m.isFunction(e), "cb must be a function"), c.allMessage.add(e), function () {
        return c.allMessage["delete"](e);
      };
    }, this.subscribeTopics = function (e) {
      m.assertNotNull(e, "topics"), m.assertIsList(e), e.forEach(function (e) {
        d.subscribed.has(e) || d.pending.add(e);
      }), b.consecutiveNoResponseRequest = 0, A();
    }, this.sendMessage = function (n) {
      if (m.assertIsObject(n, "payload"), void 0 === n.topic || y.has(n.topic)) J(e.warn("Cannot send message, Invalid topic", n));else {
        try {
          n = JSON.stringify(n);
        } catch (t) {
          return void J(e.warn("Error stringify message", n));
        }

        I() ? O().send(n) : J(e.warn("Cannot send message, web socket connection is not open"));
      }
    }, this.closeWebSocket = function () {
      N(), _(), o.reconnectWebSocket = !1, clearInterval(S), D("User request to close WebSocket");
    }, this.terminateWebSocketManager = H;
  },
      R = {
    create: function create() {
      return new x();
    },
    setGlobalConfig: function setGlobalConfig(e) {
      var n = e.loggerConfig;
      E.updateLoggerConfig(n);
    },
    LogLevel: O,
    Logger: T
  };
}, function (e, n, t) {
  var o;
  !function () {
    "use strict";

    var r = {
      not_string: /[^s]/,
      not_bool: /[^t]/,
      not_type: /[^T]/,
      not_primitive: /[^v]/,
      number: /[diefg]/,
      numeric_arg: /[bcdiefguxX]/,
      json: /[j]/,
      not_json: /[^j]/,
      text: /^[^\x25]+/,
      modulo: /^\x25{2}/,
      placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
      key: /^([a-z_][a-z_\d]*)/i,
      key_access: /^\.([a-z_][a-z_\d]*)/i,
      index_access: /^\[(\d+)\]/,
      sign: /^[+-]/
    };

    function i(e) {
      return function (e, n) {
        var t,
            o,
            c,
            s,
            a,
            u,
            l,
            f,
            p,
            d = 1,
            b = e.length,
            g = "";

        for (o = 0; o < b; o++) {
          if ("string" == typeof e[o]) g += e[o];else if ("object" == _typeof(e[o])) {
            if ((s = e[o]).keys) for (t = n[d], c = 0; c < s.keys.length; c++) {
              if (null == t) throw new Error(i('[sprintf] Cannot access property "%s" of undefined value "%s"', s.keys[c], s.keys[c - 1]));
              t = t[s.keys[c]];
            } else t = s.param_no ? n[s.param_no] : n[d++];
            if (r.not_type.test(s.type) && r.not_primitive.test(s.type) && t instanceof Function && (t = t()), r.numeric_arg.test(s.type) && "number" != typeof t && isNaN(t)) throw new TypeError(i("[sprintf] expecting number but found %T", t));

            switch (r.number.test(s.type) && (f = t >= 0), s.type) {
              case "b":
                t = parseInt(t, 10).toString(2);
                break;

              case "c":
                t = String.fromCharCode(parseInt(t, 10));
                break;

              case "d":
              case "i":
                t = parseInt(t, 10);
                break;

              case "j":
                t = JSON.stringify(t, null, s.width ? parseInt(s.width) : 0);
                break;

              case "e":
                t = s.precision ? parseFloat(t).toExponential(s.precision) : parseFloat(t).toExponential();
                break;

              case "f":
                t = s.precision ? parseFloat(t).toFixed(s.precision) : parseFloat(t);
                break;

              case "g":
                t = s.precision ? String(Number(t.toPrecision(s.precision))) : parseFloat(t);
                break;

              case "o":
                t = (parseInt(t, 10) >>> 0).toString(8);
                break;

              case "s":
                t = String(t), t = s.precision ? t.substring(0, s.precision) : t;
                break;

              case "t":
                t = String(!!t), t = s.precision ? t.substring(0, s.precision) : t;
                break;

              case "T":
                t = Object.prototype.toString.call(t).slice(8, -1).toLowerCase(), t = s.precision ? t.substring(0, s.precision) : t;
                break;

              case "u":
                t = parseInt(t, 10) >>> 0;
                break;

              case "v":
                t = t.valueOf(), t = s.precision ? t.substring(0, s.precision) : t;
                break;

              case "x":
                t = (parseInt(t, 10) >>> 0).toString(16);
                break;

              case "X":
                t = (parseInt(t, 10) >>> 0).toString(16).toUpperCase();
            }

            r.json.test(s.type) ? g += t : (!r.number.test(s.type) || f && !s.sign ? p = "" : (p = f ? "+" : "-", t = t.toString().replace(r.sign, "")), u = s.pad_char ? "0" === s.pad_char ? "0" : s.pad_char.charAt(1) : " ", l = s.width - (p + t).length, a = s.width && l > 0 ? u.repeat(l) : "", g += s.align ? p + t + a : "0" === u ? p + a + t : a + p + t);
          }
        }

        return g;
      }(function (e) {
        if (s[e]) return s[e];
        var n,
            t = e,
            o = [],
            i = 0;

        for (; t;) {
          if (null !== (n = r.text.exec(t))) o.push(n[0]);else if (null !== (n = r.modulo.exec(t))) o.push("%");else {
            if (null === (n = r.placeholder.exec(t))) throw new SyntaxError("[sprintf] unexpected placeholder");

            if (n[2]) {
              i |= 1;
              var c = [],
                  a = n[2],
                  u = [];
              if (null === (u = r.key.exec(a))) throw new SyntaxError("[sprintf] failed to parse named argument key");

              for (c.push(u[1]); "" !== (a = a.substring(u[0].length));) {
                if (null !== (u = r.key_access.exec(a))) c.push(u[1]);else {
                  if (null === (u = r.index_access.exec(a))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                  c.push(u[1]);
                }
              }

              n[2] = c;
            } else i |= 2;

            if (3 === i) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
            o.push({
              placeholder: n[0],
              param_no: n[1],
              keys: n[2],
              sign: n[3],
              pad_char: n[4],
              align: n[5],
              width: n[6],
              precision: n[7],
              type: n[8]
            });
          }
          t = t.substring(n[0].length);
        }

        return s[e] = o;
      }(e), arguments);
    }

    function c(e, n) {
      return i.apply(null, [e].concat(n || []));
    }

    var s = Object.create(null);
    n.sprintf = i, n.vsprintf = c, "undefined" != typeof window && (window.sprintf = i, window.vsprintf = c, void 0 === (o = function () {
      return {
        sprintf: i,
        vsprintf: c
      };
    }.call(n, t, n, e)) || (e.exports = o));
  }();
}, function (e, n, t) {
  "use strict";

  t.r(n), function (e) {
    t.d(n, "WebSocketManager", function () {
      return r;
    });
    var o = t(0);
    e.connect = e.connect || {}, connect.WebSocketManager = o.a;
    var r = o.a;
  }.call(this, t(3));
}, function (e, n) {
  var t;

  t = function () {
    return this;
  }();

  try {
    t = t || new Function("return this")();
  } catch (e) {
    "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (t = window);
  }

  e.exports = t;
}]);
var WebSocketManager = connect.WebSocketManager;
connect.WebSocketManager = currentWebsocketManager || WebSocketManager;
/* harmony default export */ __webpack_exports__["default"] = (WebSocketManager);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/log.js":
/*!********************!*\
  !*** ./src/log.js ***!
  \********************/
/*! exports provided: LogManager, Logger, LogLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogManager", function() { return LogManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/*eslint-disable no-unused-vars*/

var Logger = /*#__PURE__*/function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, [{
    key: "debug",
    value: function debug(data) {}
  }, {
    key: "info",
    value: function info(data) {}
  }, {
    key: "warn",
    value: function warn(data) {}
  }, {
    key: "error",
    value: function error(data) {}
  }]);

  return Logger;
}();
/*eslint-enable no-unused-vars*/


var LogLevel = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40
};

var LogManagerImpl = /*#__PURE__*/function () {
  function LogManagerImpl() {
    _classCallCheck(this, LogManagerImpl);

    this.updateLoggerConfig();
    this.consoleLoggerWrapper = createConsoleLogger();
  }

  _createClass(LogManagerImpl, [{
    key: "writeToClientLogger",
    value: function writeToClientLogger(level, logStatement) {
      if (!this.hasClientLogger()) {
        return;
      }

      switch (level) {
        case LogLevel.DEBUG:
          return this._clientLogger.debug(logStatement);

        case LogLevel.INFO:
          return this._clientLogger.info(logStatement);

        case LogLevel.WARN:
          return this._clientLogger.warn(logStatement);

        case LogLevel.ERROR:
          return this._clientLogger.error(logStatement);
      }
    }
  }, {
    key: "isLevelEnabled",
    value: function isLevelEnabled(level) {
      return level >= this._level;
    }
  }, {
    key: "hasClientLogger",
    value: function hasClientLogger() {
      return this._clientLogger !== null;
    }
  }, {
    key: "getLogger",
    value: function getLogger(options) {
      var prefix = options.prefix || "";

      if (this._logsDestination === _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].DEBUG) {
        return this.consoleLoggerWrapper;
      }

      return new LoggerWrapperImpl(prefix);
    }
  }, {
    key: "updateLoggerConfig",
    value: function updateLoggerConfig(inputConfig) {
      var config = inputConfig || {};
      this._level = config.level || LogLevel.INFO;
      this._clientLogger = config.logger || null;
      this._logsDestination = _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].NULL;

      if (config.debug) {
        this._logsDestination = _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].DEBUG;
      }

      if (config.logger) {
        this._logsDestination = _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].CLIENT_LOGGER;
      }
    }
  }]);

  return LogManagerImpl;
}();

var LoggerWrapper = /*#__PURE__*/function () {
  function LoggerWrapper() {
    _classCallCheck(this, LoggerWrapper);
  }

  _createClass(LoggerWrapper, [{
    key: "debug",
    value: function debug() {}
  }, {
    key: "info",
    value: function info() {}
  }, {
    key: "warn",
    value: function warn() {}
  }, {
    key: "error",
    value: function error() {}
  }]);

  return LoggerWrapper;
}();

var LoggerWrapperImpl = /*#__PURE__*/function (_LoggerWrapper) {
  _inherits(LoggerWrapperImpl, _LoggerWrapper);

  var _super = _createSuper(LoggerWrapperImpl);

  function LoggerWrapperImpl(prefix) {
    var _this;

    _classCallCheck(this, LoggerWrapperImpl);

    _this = _super.call(this);
    _this.prefix = prefix || "";
    return _this;
  }

  _createClass(LoggerWrapperImpl, [{
    key: "debug",
    value: function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._log(LogLevel.DEBUG, args);
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this._log(LogLevel.INFO, args);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this._log(LogLevel.WARN, args);
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this._log(LogLevel.ERROR, args);
    }
  }, {
    key: "_shouldLog",
    value: function _shouldLog(level) {
      return LogManager.hasClientLogger() && LogManager.isLevelEnabled(level);
    }
  }, {
    key: "_writeToClientLogger",
    value: function _writeToClientLogger(level, logStatement) {
      LogManager.writeToClientLogger(level, logStatement);
    }
  }, {
    key: "_log",
    value: function _log(level, args) {
      if (this._shouldLog(level)) {
        var logStatement = this._convertToSingleStatement(args);

        this._writeToClientLogger(level, logStatement);
      }
    }
  }, {
    key: "_convertToSingleStatement",
    value: function _convertToSingleStatement(args) {
      var logStatement = "";

      if (this.prefix) {
        logStatement += this.prefix + " ";
      }

      for (var index = 0; index < args.length; index++) {
        var arg = args[index];
        logStatement += this._convertToString(arg) + " ";
      }

      return logStatement;
    }
  }, {
    key: "_convertToString",
    value: function _convertToString(arg) {
      try {
        if (!arg) {
          return "";
        }

        if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isString(arg)) {
          return arg;
        }

        if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(arg) && _utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(arg.toString)) {
          var toStringResult = arg.toString();

          if (toStringResult !== "[object Object]") {
            return toStringResult;
          }
        }

        return JSON.stringify(arg);
      } catch (error) {
        console.error("Error while converting argument to string", arg, error);
        return "";
      }
    }
  }]);

  return LoggerWrapperImpl;
}(LoggerWrapper);

var createConsoleLogger = function createConsoleLogger() {
  var logger = new LoggerWrapper();
  logger.debug = console.debug.bind(window.console);
  logger.info = console.info.bind(window.console);
  logger.warn = console.warn.bind(window.console);
  logger.error = console.error.bind(window.console);
  return logger;
};

var LogManager = new LogManagerImpl();


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/exceptions */ "./src/core/exceptions.js");
/* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sprintf-js */ "./node_modules/sprintf-js/src/sprintf.js");
/* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sprintf_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }





var Utils = {};
/**
 * Asserts that a premise is true.
 */

Utils.assertTrue = function (premise, message) {
  if (!premise) {
    throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["ValueError"](message);
  }
};
/**
 * Asserts that a value is not null or undefined.
 */


Utils.assertNotNull = function (value, name) {
  Utils.assertTrue(value !== null && _typeof(value) !== undefined, Object(sprintf_js__WEBPACK_IMPORTED_MODULE_1__["sprintf"])("%s must be provided", name || "A value"));
  return value;
};

Utils.now = function () {
  return new Date().getTime();
};

Utils.isString = function (value) {
  return typeof value === "string";
};
/**
 * Generate a random ID consisting of the current timestamp
 * and a random base-36 number based on Math.random().
 */


Utils.randomId = function () {
  return Object(sprintf_js__WEBPACK_IMPORTED_MODULE_1__["sprintf"])("%s-%s", Utils.now(), Math.random().toString(36).slice(2));
};

Utils.assertIsNonEmptyString = function (value, key) {
  if (!value || typeof value !== "string") {
    throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " is not a non-empty string!");
  }
};

Utils.assertIsList = function (value, key) {
  if (!Array.isArray(value)) {
    throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " is not an array");
  }
};

Utils.assertIsEnum = function (value, allowedValues, key) {
  var i;

  for (i = 0; i < allowedValues.length; i++) {
    if (allowedValues[i] === value) {
      return;
    }
  }

  throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " passed (" + value + ")" + " is not valid. Allowed values are: " + allowedValues);
};
/**
 * Generate an enum from the given list of lower-case enum values,
 * where the enum keys will be upper case.
 *
 * Conversion from pascal case based on code from here:
 * http://stackoverflow.com/questions/30521224
 */


Utils.makeEnum = function (values) {
  var enumObj = {};
  values.forEach(function (value) {
    var key = value.replace(/\.?([a-z]+)_?/g, function (x, y) {
      return y.toUpperCase() + "_";
    }).replace(/_$/, "");
    enumObj[key] = value;
  });
  return enumObj;
};

Utils.contains = function (obj, value) {
  if (obj instanceof Array) {
    return Utils.find(obj, function (v) {
      return v === value;
    }) !== null;
  } else {
    return value in obj;
  }
};

Utils.find = function (array, predicate) {
  for (var x = 0; x < array.length; x++) {
    if (predicate(array[x])) {
      return array[x];
    }
  }

  return null;
};

Utils.containsValue = function (obj, value) {
  if (obj instanceof Array) {
    return Utils.find(obj, function (v) {
      return v === value;
    }) !== null;
  } else {
    return Utils.find(Utils.values(obj), function (v) {
      return v === value;
    }) !== null;
  }
};
/**
 * Determine if the given value is a callable function type.
 * Borrowed from Underscore.js.
 */


Utils.isFunction = function (obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};
/**
 * Get a list of values from a Javascript object used
 * as a hash map.
 */


Utils.values = function (map) {
  var values = [];
  Utils.assertNotNull(map, "map");

  for (var k in map) {
    values.push(map[k]);
  }

  return values;
};

Utils.isObject = function (value) {
  return !(_typeof(value) !== "object" || value === null);
};

Utils.assertIsObject = function (value, key) {
  if (!Utils.isObject(value)) {
    throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " is not an object!");
  }
};

Utils.delay = function (ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

Utils.asyncWhileInterval = function (f, predicate, interval) {
  var count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var error = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var now = new Date();

  if (predicate(count)) {
    return f(count)["catch"](function (e) {
      var delay = Math.max(0, interval - new Date().valueOf() + now.valueOf());
      return Utils.delay(delay).then(function () {
        return Utils.asyncWhileInterval(f, predicate, interval, count + 1, e);
      });
    });
  } else {
    return Promise.reject(error || new Error("async while aborted"));
  }
};

Utils.isAttachmentContentType = function (contentType) {
  return contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].applicationPdf || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].imageJpg || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].imagePng || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].applicationDoc || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].applicationXls || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].applicationPpt || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].textCsv || contentType === _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].audioWav;
};

/* harmony default export */ __webpack_exports__["default"] = (Utils);

/***/ })

/******/ });
//# sourceMappingURL=amazon-connect-chat.js.map