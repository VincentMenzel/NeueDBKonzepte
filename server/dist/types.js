"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["CONNECTION"] = "connection";
    SocketEvents["SEND_MESSAGE"] = "send_message";
    SocketEvents["EMIT_MESSAGE"] = "emit_message";
    SocketEvents["SEND_COMMENT"] = "send_comment";
    SocketEvents["EMIT_COMMENT"] = "emit_comment";
    SocketEvents["GET_MESSAGE_HISTORY"] = "get_message_history";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.DB_NAME = "NewDBConcepts";
    Database.COLLECTIONS = {
        MESSAGES: "messages"
    };
    return Database;
}());
exports.Database = Database;
