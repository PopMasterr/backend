import { Engine } from "json-rules-engine";

export let engine = new Engine();

const firstGuessRule = {
    conditions: {
        all: [{
            fact: 'gamesPlayed',
            operator: 'greaterThanInclusive',
            value: 1
        }]
    },
    event: {
        type: 'firstGuess',
        params: {
            message: 'Make your first guess',
            achievementId: 1
        }
    }
};

const bullseye = {
    conditions: {
        all: [{
            fact: 'perfectGuesses',
            operator: 'greaterThanInclusive',
            value: 1
        }]
    },
    event: {
        type: 'doubleAce',
        params: {
            message: 'Guess within 1% of the actual population 10 times (10 perfect guesses)',
            achievementId: 2
        }
    }
};

const doubleAce = {
    conditions: {
        all: [{
            fact: 'perfectGuesses',
            operator: 'greaterThanInclusive',
            value: 10
        }]
    },
    event: {
        type: 'doubleAce',
        params: {
            message: 'Guess within 5% of the actual population 10 times (10 perfect guesses)',
            achievementId: 3
        }
    }
};

const blindShot = {
    conditions: {
        all: [{
            fact: 'score',
            operator: 'equal',
            value: 0
        }]
    },
    event: {
        type: 'blindShot',
        params: {
            message: 'Make a guess that\'s off by more than 95% (get score 0)',
            achievementId: 4
        }
    }
};

const rookie = {
    conditions: {
        all: [{
            fact: 'gamesPlayed',
            operator: 'greaterThanInclusive',
            value: 10
        }]
    },
    event: {
        type: 'rookie',
        params: {
            message: 'Play 10 rounds',
            achievementId: 5
        }
    }
};

const broker = {
    conditions: {
        all: [{
            fact: 'gamesPlayed',
            operator: 'greaterThanInclusive',
            value: 50
        }]
    },
    event: {
        type: 'broker',
        params: {
            message: 'Play 50 rounds',
            achievementId: 6
        }
    }
};

const veteran = {
    conditions: {
        all: [{
            fact: 'gamesPlayed',
            operator: 'greaterThanInclusive',
            value: 100
        }]
    },
    event: {
        type: 'veteran',
        params: {
            message: 'Play 100 rounds',
            achievementId: 7
        }
    }
};

const no = {
    conditions: {
        all: [{
            fact: 'gamesPlayed',
            operator: 'greaterThanInclusive',
            value: 1337
        }]
    },
    event: {
        type: 'no',
        params: {
            message: 'Play 1337 rounds',
            achievementId: 8
        }
    }
};

export const allAchievements = [firstGuessRule, bullseye, doubleAce, blindShot, rookie, broker, veteran, no];

engine.addRule(firstGuessRule);
engine.addRule(bullseye);
engine.addRule(doubleAce);
engine.addRule(blindShot);
engine.addRule(rookie);
engine.addRule(broker);
engine.addRule(veteran);
engine.addRule(no);