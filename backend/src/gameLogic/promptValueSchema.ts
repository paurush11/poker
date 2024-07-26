import prompt from 'prompt';


const NoOfPlayersSchema: prompt.Schema = {
    properties: {
        noOfPlayers: {
            description: 'Please enter the number of players (2 - 6): ',
            pattern: /^[2-6]$/,
            message: 'Number of players must be between 2 and 6',
            required: true,
            conform(value: string) {
                return value === '2' || value === '3' || value === '4' || value === '5' || value === '6';
            },
        }
    }
};

const PlayerDetailsSchema: prompt.Schema = {
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

const NoBetSchema: prompt.Schema = {
    properties: {
        action: {
            description: 'Please choose a number (1 - Check, or 2 - Bet): ',
            pattern: /^[1-5]$/,
            message: 'Choice must be 1, or 2',
            required: true,
            conform(value: string) {
                return value === '1' || value === '2';
            },
        }
    }
};

const BetSchema: prompt.Schema = {
    properties: {
        action: {
            description: 'Please choose a number (1 - Call, 2 - Raise , or 3 - Fold): ',
            pattern: /^[1-5]$/,
            message: 'Choice must be 1, 2 or 3',
            required: true,
            conform(value: string) {
                return value === '1' || value === '2' || value === '3';
            },
        }
    }
};


const RaiseSchema: prompt.Schema = {
    properties: {
        amount: {
            description: 'Please enter the amount to raise (5, 10, 15, 25, 50, 100): ',
            pattern: /^[0-9]+$/,
            message: 'Amount must be a number and one of the following values: 5, 10, 15, 25, 50, 100',
            required: true,
            conform(value: string) {
                const allowedValues = [5, 10, 15, 25, 50, 100];
                return /^[0-9]+$/.test(value) && allowedValues.includes(Number(value));
            },
        }
    }
};

const smallBlindSchema: prompt.Schema = {
    properties: {
        amount: {
            description: 'Please enter the amount to add to the pot (5, 10, 15, 25, 50): ',
            pattern: /^[0-9]+$/,
            message: 'Amount must be a number and one of the following values: 5, 10, 15, 25, 50',
            required: true,
            conform(value: string) {
                const allowedValues = [5, 10, 15, 25, 50];
                return /^[0-9]+$/.test(value) && allowedValues.includes(Number(value));
            },
        }
    }
};


const askForNoOfPlayers = async (): Promise<number> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(NoOfPlayersSchema, (err, result) => {
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
};


const askForPlayerDetails = async (): Promise<{ name: string, balance: number }> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(PlayerDetailsSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const name = result.name as string;
            const balance = Number(result.balance);
            if (Number.isNaN(balance) || balance < 0) {
                reject(new Error("Balance cannot be negative"));
            }
            resolve({ name, balance });
        });
    });
};



const askForSmallBlind = async (): Promise<number> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(smallBlindSchema, (err, result) => {
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
};

const askForLargeBlind = async (smallBlindNumber: number): Promise<number> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(smallBlindSchema, (err, result) => {
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
};

const askForBet = async (): Promise<number> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(RaiseSchema, (err, result) => {
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
};
const currentPlayerBetWhenBetAlreadySet = async (): Promise<string> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(BetSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const action = Number(result.action);
            if (action === 1) {
                resolve("call");
            } else if (action === 2) {
                resolve("raise");
            } else if (action === 3) {
                resolve("fold");
            } else {
                reject(new Error("Invalid input"));
            }
        });
    });
}

const currentPlayerBetWhenNoBetSet = async (): Promise<string> => {
    prompt.start();
    return new Promise((resolve, reject) => {
        prompt.get(NoBetSchema, (err, result) => {
            if (err) {
                reject(new Error("Invalid input"));
            }
            const action = Number(result.action);
            if (action === 1) {
                resolve("check");
            } else if (action === 2) {
                resolve("bet");
            } else {
                reject(new Error("Invalid input"));
            }
        });
    });
}

export {
    NoBetSchema,
    BetSchema,
    RaiseSchema,
    askForLargeBlind,
    askForSmallBlind,
    currentPlayerBetWhenBetAlreadySet,
    currentPlayerBetWhenNoBetSet,
    askForBet,
    askForNoOfPlayers,
    askForPlayerDetails
}