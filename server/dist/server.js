"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var types_1 = require("./types");
var mongodb_1 = require("mongodb");
var socketIo = require("socket.io");
var app = express_1.default();
var client = new mongodb_1.MongoClient("mongodb://localhost:27017");
app.use(cors_1.default({
    origin: "http://localhost:3000"
}));
exports.server = http_1.default.createServer(app);
var buildPath = path_1.default.join(__dirname, '../../client/build');
app.use(express_1.default.static(buildPath));
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(buildPath, 'index.html'));
});
exports.server.listen(3500, function () { return __awaiter(void 0, void 0, void 0, function () {
    var db, messageCol, socket, cons;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                db = client.db(types_1.Database.DB_NAME);
                messageCol = db.collection(types_1.Database.COLLECTIONS.MESSAGES);
                socket = socketIo(exports.server, {
                    cors: {
                        origin: "http://localhost:3000"
                    }
                });
                cons = 0;
                socket.on("connection", function (uSocket) {
                    console.log("con", cons++);
                    messageCol.find().toArray().then(function (messages) {
                        // console.log(messages)
                        uSocket.emit(types_1.SocketEvents.GET_MESSAGE_HISTORY, messages);
                    });
                    uSocket.on(types_1.SocketEvents.SEND_MESSAGE, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                        var newMessage, newEntry;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    newMessage = __assign(__assign({}, msg), { comments: [] });
                                    return [4 /*yield*/, messageCol.insertOne(newMessage)];
                                case 1:
                                    newEntry = _a.sent();
                                    newMessage._id = newEntry.insertedId;
                                    socket.emit(types_1.SocketEvents.EMIT_MESSAGE, newMessage);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    uSocket.on(types_1.SocketEvents.SEND_COMMENT, function (comment) {
                        var newComment = __assign({ _id: new mongodb_1.ObjectID() }, comment);
                        console.log(comment);
                        messageCol.updateOne({ _id: new mongodb_1.ObjectID(comment.messageId) }, { $push: { comments: newComment } });
                        socket.emit(types_1.SocketEvents.EMIT_COMMENT, newComment);
                    });
                });
                socket.on("disconnect", function () { return console.log("cons: ", cons--); });
                return [2 /*return*/];
        }
    });
}); });
