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
exports.askForPlayerDetails = exports.askForNoOfPlayers = exports.askForBet = exports.currentPlayerBetWhenNoBetSet = exports.currentPlayerBetWhenBetAlreadySet = exports.askForSmallBlind = exports.askForLargeBlind = exports.RaiseSchema = exports.BetSchema = exports.NoBetSchema = void 0;
const prompt_1 = __importDefault(require("prompt"));
const NoOfPlayersSchema = {
    properties: {
        noOfPlayers: {
            description: 'Please enter the number of players (2 - 6): ',
            pattern: /^[2-6]$/,
            message: 'Number of players must be between 2 and 6',
            required: true,
            conform(value) {
                return value === '2' || value === '3' || value === '4' || value === '5' || value === '6';
            },
        }
    }
};
const PlayerDetailsSchema = {
    properties: {
        name: {
            description: 'Please enter the name of the player: ',
            pattern: /^[a-zA-Z]+$/,
            message: 'Name must be alphabetic characters',
            required: true,
        },
        balance: {
            description: 'Please enter the balance of the player: ',
            pattern: /^[0-9]+$/,
            message: 'Balance must be a number',
            required: true,
        }
    }
};
const NoBetSchema = {
    properties: {
        action: {
            description: 'Please choose a number (1 - Check, or 2 - Bet): ',
            pattern: /^[1-5]$/,
            message: 'Choice must be 1, or 2',
            required: true,
            conform(value) {
                return value === '1' || value === '2';
            },
        }
    }
};
exports.NoBetSchema = NoBetSchema;
const BetSchema = {
    properties: {
        action: {
            description: 'Please choose a number (1 - Call, 2 - Raise , or 3 - Fold): ',
            pattern: /^[1-5]$/,
            message: 'Choice must be 1, 2 or 3',
            required: true,
            conform(value) {
                return value === '1' || value === '2' || value === '3';
            },
        }
    }
};
exports.BetSchema = BetSchema;
const RaiseSchema = {
    properties: {
        amount: {
            description: 'Please enter the amount to raise (5, 10, 15, 25, 50, 100): ',
            pattern: /^[0-9]+$/,
            message: 'Amount must be a number and one of the following values: 5, 10, 15, 25, 50, 100',
            required: true,
            conform(value) {
                const allowedValues = [5, 10, 15, 25, 50, 100];
                return /^[0-9]+$/.test(value) && allowedValues.includes(Number(value));
            },
        }
    }
};
exports.RaiseSchema = RaiseSchema;
const smallBlindSchema = {
    properties: {
        amount: {
            description: 'Please enter the amount to add to the pot (5, 10, 15, 25, 50): ',
            pattern: /^[0-9]+$/,
            message: 'Amount must be a number and one of the following values: 5, 10, 15, 25, 50',
            required: true,
            conform(value) {
                const allowedValues = [5, 10, 15, 25, 50];
                return /^[0-9]+$/.test(value) && allowedValues.includes(Number(value));
            },
        }
    }
};
const askForNoOfPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(NoOfPlayersSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const noOfPlayers = Number(result.noOfPlayers);
            if (Number.isNaN(noOfPlayers) || noOfPlayers < 2 || noOfPlayers > 6) {
                reject(new Error("Number of players must be between 2 and 6"));
            }
            resolve(noOfPlayers);
        });
    });
});
exports.askForNoOfPlayers = askForNoOfPlayers;
const askForPlayerDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(PlayerDetailsSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const name = result.name;
            const balance = Number(result.balance);
            if (Number.isNaN(balance) || balance < 0) {
                reject(new Error("Balance cannot be negative"));
            }
            resolve({ name, balance });
        });
    });
});
exports.askForPlayerDetails = askForPlayerDetails;
const askForSmallBlind = () => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(smallBlindSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const smallAmount = Number(result.amount);
            if (Number.isNaN(smallAmount) || smallAmount < 0) {
                reject(new Error("Amount cannot be negative"));
            }
            resolve(smallAmount);
        });
    });
});
exports.askForSmallBlind = askForSmallBlind;
const askForLargeBlind = (smallBlindNumber) => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(smallBlindSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const largeAmount = Number(result.amount);
            if (Number.isNaN(largeAmount) || largeAmount < 0) {
                reject(new Error("Amount cannot be negative"));
            }
            if (largeAmount <= smallBlindNumber) {
                reject(new Error("Amount must be greater than small blind"));
            }
            resolve(largeAmount);
        });
    });
});
exports.askForLargeBlind = askForLargeBlind;
const askForBet = () => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(RaiseSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const amount = Number(result.amount);
            if (Number.isNaN(amount) || amount < 0) {
                reject(new Error("Amount cannot be negative"));
            }
            resolve(amount);
        });
    });
});
exports.askForBet = askForBet;
const currentPlayerBetWhenBetAlreadySet = () => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(BetSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const action = Number(result.action);
            if (action === 1) {
                resolve("call");
            }
            else if (action === 2) {
                resolve("raise");
            }
            else if (action === 3) {
                resolve("fold");
            }
            else {
                reject(new Error("Invalid input"));
            }
        });
    });
});
exports.currentPlayerBetWhenBetAlreadySet = currentPlayerBetWhenBetAlreadySet;
const currentPlayerBetWhenNoBetSet = () => __awaiter(void 0, void 0, void 0, function* () {
    prompt_1.default.start();
    return new Promise((resolve, reject) => {
        prompt_1.default.get(NoBetSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const action = Number(result.action);
            if (action === 1) {
                resolve("check");
            }
            else if (action === 2) {
                resolve("bet");
            }
            else {
                reject(new Error("Invalid input"));
            }
        });
    });
});
exports.currentPlayerBetWhenNoBetSet = currentPlayerBetWhenNoBetSet;
