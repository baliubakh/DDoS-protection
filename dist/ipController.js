"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const FILE_PATH = path_1.default.join(__dirname, "..", "iplist.txt");
class IpHandler {
    // Get IP list from file
    static getIpList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs_1.default.promises.readFile(FILE_PATH, "utf8");
                return data.split("\n").filter((ip) => ip);
            }
            catch (error) {
                console.error("Error reading IP list file:", error);
                return [];
            }
        });
    }
    // Add an IP address to the list and file
    static addIpAddress(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const ipList = yield IpHandler.getIpList();
            console.log(!ipList.includes(ip));
            if (!ipList.includes(ip)) {
                try {
                    console.log({ ipList, ip });
                    yield fs_1.default.promises.appendFile(FILE_PATH, `${ip}\n`);
                    console.log(`IP ${ip} added to the file.`);
                }
                catch (error) {
                    console.error("Error writing to file:", error);
                }
            }
        });
    }
    // Delete an IP address from the file
    static deleteIpAddress(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const ipList = (yield IpHandler.getIpList()).filter((item) => item !== ip);
            try {
                yield fs_1.default.promises.writeFile(FILE_PATH, ipList.join("\n"));
            }
            catch (error) {
                console.error("Error deleting IP from file:", error);
            }
        });
    }
}
exports.default = IpHandler;
