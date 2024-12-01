"use strict";
// import axios from 'axios';
// import { PrismaClient } from '@prisma/client';
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchUsers;
// const prisma = new PrismaClient();
// export default async function fetchUsers(): Promise<void> {
//   try {
//     console.log(`[FETCH USERS] Fetching users from API...`);
//     const response = await axios.get('https://randomuser.me/api/', {
//       params: { results: 5 },
//     });
//     const users = response.data.results;
//     const userData = users.map((user: any) => ({
//       name: `${user.name.first} ${user.name.last}`,
//       email: user.email,
//       gender: user.gender,
//       createdAt: new Date(),
//       location: {
//         city: user.location.city,
//         country: user.location.country,
//       },
//     }));
//     console.log(`[FETCH USERS] Saving users to database...`);
//     for (const user of userData) {
//       await prisma.user.create({
//         data: {
//           name: user.name,
//           email: user.email,
//           gender: user.gender,
//           createdAt: user.createdAt,
//           locations: {
//             create: {
//               city: user.location.city,
//               country: user.location.country,
//             },
//           },
//         },
//       });
//     }
//     console.log(`[FETCH USERS] Successfully saved users.`);
//   } catch (error) {
//     console.error(`[FETCH USERS] Error occurred:`, error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
var axios_1 = require("axios");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var response, users, userData, createdUsers, createdUserEmails, usersWithIds_1, locationData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 8]);
                    console.log("[FETCH USERS] Fetching users from API...");
                    return [4 /*yield*/, axios_1.default.get('https://randomuser.me/api/', {
                            params: { results: 5 },
                        })];
                case 1:
                    response = _a.sent();
                    users = response.data.results;
                    console.log("[FETCH USERS] Saving users to database...");
                    userData = users.map(function (user) { return ({
                        name: "".concat(user.name.first, " ").concat(user.name.last),
                        email: user.email,
                        gender: user.gender,
                        createdAt: new Date(),
                    }); });
                    return [4 /*yield*/, prisma.user.createMany({
                            data: userData,
                            skipDuplicates: true, // Optional: prevent errors if users already exist
                        })];
                case 2:
                    createdUsers = _a.sent();
                    createdUserEmails = users.map(function (user) { return user.email; });
                    return [4 /*yield*/, prisma.user.findMany({
                            where: {
                                email: { in: createdUserEmails },
                            },
                        })];
                case 3:
                    usersWithIds_1 = _a.sent();
                    locationData = users.map(function (user) {
                        var _a;
                        return ({
                            city: user.location.city,
                            country: user.location.country,
                            userId: (_a = usersWithIds_1.find(function (u) { return u.email === user.email; })) === null || _a === void 0 ? void 0 : _a.id, // Find the correct userId
                        });
                    });
                    // Insert all locations in one batch
                    return [4 /*yield*/, prisma.location.createMany({
                            data: locationData,
                        })];
                case 4:
                    // Insert all locations in one batch
                    _a.sent();
                    console.log("[FETCH USERS] Successfully saved users and locations.");
                    return [3 /*break*/, 8];
                case 5:
                    error_1 = _a.sent();
                    console.error("[FETCH USERS] Error occurred:", error_1);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, prisma.$disconnect()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
