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
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const ipController_1 = __importDefault(require("./ipController"));
const app = (0, express_1.default)();
const PORT = 3000;
let limiterEnabled = true; // Flag to enable or disable rate limiting
// Middleware for rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        console.log("here!!!");
        req.ip && ipController_1.default.addIpAddress(req.ip); // Log IP to file
        res.status(429).send("Too many requests, please try again later.");
    },
});
// Conditional rate limiting middleware
const conditionalLimiter = (req, res, next) => {
    if (limiterEnabled) {
        return limiter(req, res, next);
    }
    next();
};
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Main route - display IP list with rate limiting
app.get("/home", conditionalLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
}));
// Route to toggle rate limiting
app.post("/toggle-limiter", (req, res) => {
    limiterEnabled = !limiterEnabled;
    res.json({ limiterEnabled });
});
// Editor route
app.get("/editor", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "editor.html"));
});
// API to manage IP list
app.post("/api/iplist/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip } = req.body;
    yield ipController_1.default.addIpAddress(ip);
    res.sendStatus(200);
}));
app.post("/api/iplist/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip } = req.body;
    yield ipController_1.default.deleteIpAddress(ip);
    res.sendStatus(200);
}));
app.get("/api/iplist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ipList = yield ipController_1.default.getIpList();
    res.json(ipList);
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
