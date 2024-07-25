"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = require("./Card");
const HandEvaluator_1 = require("./HandEvaluator");
const Player_1 = require("./Player");
const rankPlayers = (players, communityCards) => {
    // // Calculate scores for each player
    // const playerScores = players.map(player => {
    //     const { score, tiebreaker, comparison } = HandEvaluator.calculateScore(player.hand, communityCards);
    //     return { player, score, tiebreaker, comparison };
    // });
    // // Sort players based on their scores and tiebreakers
    // playerScores.sort((a, b) => {
    //     if (a.score !== b.score) {
    //         return b.score - a.score; // Higher scores come first
    //     }
    //     // Use tiebreaker for players with the same score
    //     return HandEvaluator.compareCardsOfSameTieBreaker(b.tiebreaker, a.tiebreaker, b.comparison);
    // });
    // // Rank players, grouping those with the same score under the same rank
    // const playerRankings = new Map();
    // let currentRank = 1;
    // let currentGroup: string[] = [];
    // let lastScore: number | null = null;
    // playerScores.forEach((playerScore, index) => {
    //     if (lastScore !== playerScore.score) {
    //         // This player has a different score than the last player
    //         if (currentGroup.length) {
    //             playerRankings.set(currentRank, currentGroup);
    //             currentRank += 1;
    //         }
    //         currentGroup = []; // Reset current group for new rank
    //         lastScore = playerScore.score;
    //     }
    //     currentGroup.push(playerScore.player.name + '-' + playerScore.score + '-' + playerScore.comparison); // Add player to current group
    //     // Always update the map on the last iteration
    //     if (index === playerScores.length - 1) {
    //         playerRankings.set(currentRank, currentGroup);
    //     }
    // });
    // console.log(playerRankings);
    const playerScores = players.map(player => {
        const { score, tiebreaker, comparison } = HandEvaluator_1.HandEvaluator.calculateScore(player.hand, communityCards);
        return { player, score, tiebreaker, comparison };
    });
    playerScores.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        return HandEvaluator_1.HandEvaluator.compareCardsOfSameTieBreaker(b.tiebreaker, a.tiebreaker, a.comparison);
    });
    const playerRankings = new Map(playerScores.map((playerScore, index) => [playerScore.player.id + '-' + playerScore.player.name + '-' + playerScore.score + '-' + playerScore.comparison, index + 1]));
    console.log(playerRankings);
};
const runRoyalFlushTest = () => {
    console.log("Test 1: test all others");
    // Create dummy players with different poker hands
    const player1 = new Player_1.Player("Alice", 100); // Royal Flush
    const player2 = new Player_1.Player("Bob", 200); // Straight Flush
    const player3 = new Player_1.Player("Charlie", 300); // Full House
    const player4 = new Player_1.Player("Dana", 400); // Full House
    const player5 = new Player_1.Player("Eve", 500); // Flush
    const player6 = new Player_1.Player("Frank", 600); // Straight
    const player7 = new Player_1.Player("Grace", 700); // Full House
    const player8 = new Player_1.Player("Hank", 800); // Two Pairs
    const player9 = new Player_1.Player("Ivy", 900); // Pair
    const player10 = new Player_1.Player("Jack", 1000); // High Card
    // Assign cards to each player
    // Community cards that will be shared by some hands to form the best combination
    const communityCards = [
        new Card_1.Card("Hearts", "Jack"),
        new Card_1.Card("Hearts", "10"),
        new Card_1.Card("Hearts", "9"),
        new Card_1.Card("Hearts", "King"),
        new Card_1.Card("Clubs", "King"),
    ];
    // Individual hands
    player1.hand = [new Card_1.Card("Hearts", "Ace"), new Card_1.Card("Hearts", "Queen")]; // Completes Royal Flush with community
    player2.hand = [new Card_1.Card("Hearts", "8"), new Card_1.Card("Hearts", "7")]; // Completes Straight Flush with community
    player3.hand = [new Card_1.Card("Clubs", "9"), new Card_1.Card("Clubs", "9")]; // Full House  with community Kings
    player4.hand = [new Card_1.Card("Clubs", "9"), new Card_1.Card("Hearts", "9")]; // Full House with community Kings
    player5.hand = [new Card_1.Card("Hearts", "2"), new Card_1.Card("Hearts", "3")]; // Flush with community Hearts
    player6.hand = [new Card_1.Card("Clubs", "8"), new Card_1.Card("Diamonds", "7")]; // Straight with community Jack, 10, 9
    player7.hand = [new Card_1.Card("Diamonds", "9"), new Card_1.Card("Spades", "9")]; // Three of a Kind with community King
    player8.hand = [new Card_1.Card("Clubs", "10"), new Card_1.Card("Diamonds", "Jack")]; // Two Pairs with community Jack, King
    player9.hand = [new Card_1.Card("Clubs", "Ace"), new Card_1.Card("Diamonds", "Ace")]; // Pair with community cards
    player10.hand = [new Card_1.Card("Spades", "2"), new Card_1.Card("Diamonds", "3")]; // High Card with community Ace, King
    // Create players array and apply ranking
    const players = [player1, player2, player3, player4, player5, player6, player7, player8, player9, player10];
    // const players = [player3];
    // players.forEach(player => {
    //     const { score, tiebreaker, comparison } = HandEvaluator.calculateScore(player.hand, communityCards);
    //     console.log(`${player.name}: ${score} (${comparison})`);
    // })
    rankPlayers(players, communityCards);
};
const test1 = () => {
    console.log("Test 1: for Royal Flush vs Two Pairs vs High Card");
    // Create dummy players
    const player1 = new Player_1.Player("Alice", 100);
    const player2 = new Player_1.Player("Bob", 200);
    const player3 = new Player_1.Player("Charlie", 300);
    // Create dummy hands
    player1.addCard(new Card_1.Card("Hearts", "Ace"));
    player1.addCard(new Card_1.Card("Hearts", "King"));
    player2.addCard(new Card_1.Card("Spades", "Queen"));
    player2.addCard(new Card_1.Card("Spades", "Jack"));
    player3.addCard(new Card_1.Card("Diamonds", "4"));
    player3.addCard(new Card_1.Card("Diamonds", "9"));
    // Create dummy community cards
    const communityCards = [
        new Card_1.Card("Hearts", "Queen"),
        new Card_1.Card("Hearts", "Jack"),
        new Card_1.Card("Hearts", "10"),
        new Card_1.Card("Clubs", "2"),
        new Card_1.Card("Diamonds", "7")
    ];
    // Create players array
    const players = [player1, player2, player3];
    // Call the rankPlayers function
    rankPlayers(players, communityCards);
};
const test2 = () => {
    console.log("Test 2: Straight Flush vs Four of a Kind vs Straight");
    const player1 = new Player_1.Player("David", 100);
    const player2 = new Player_1.Player("Emma", 200);
    const player3 = new Player_1.Player("Frank", 300);
    player1.addCard(new Card_1.Card("Hearts", "8"));
    player1.addCard(new Card_1.Card("Hearts", "9"));
    player2.addCard(new Card_1.Card("Spades", "Ace"));
    player2.addCard(new Card_1.Card("Clubs", "Ace"));
    player3.addCard(new Card_1.Card("Diamonds", "King"));
    player3.addCard(new Card_1.Card("Clubs", "King"));
    const communityCards = [
        new Card_1.Card("Hearts", "10"),
        new Card_1.Card("Hearts", "Jack"),
        new Card_1.Card("Hearts", "Queen"),
        new Card_1.Card("Diamonds", "Ace"),
        new Card_1.Card("Hearts", "Ace")
    ];
    const players = [player1, player2, player3];
    rankPlayers(players, communityCards);
};
const test3 = () => {
    console.log("Test 3: Flush vs Straight vs Three of a Kind");
    const player1 = new Player_1.Player("Grace", 100);
    const player2 = new Player_1.Player("Henry", 200);
    const player3 = new Player_1.Player("Ivy", 300);
    player1.addCard(new Card_1.Card("Clubs", "2"));
    player1.addCard(new Card_1.Card("Clubs", "4"));
    player2.addCard(new Card_1.Card("Hearts", "9"));
    player2.addCard(new Card_1.Card("Diamonds", "10"));
    player3.addCard(new Card_1.Card("Spades", "7"));
    player3.addCard(new Card_1.Card("Hearts", "7"));
    const communityCards = [
        new Card_1.Card("Clubs", "Ace"),
        new Card_1.Card("Clubs", "King"),
        new Card_1.Card("Clubs", "Queen"),
        new Card_1.Card("Hearts", "Jack"),
        new Card_1.Card("Diamonds", "7")
    ];
    const players = [player1, player2, player3];
    rankPlayers(players, communityCards);
};
const test4 = () => {
    console.log("Test 4: Two Pair vs One Pair vs One pair");
    const player1 = new Player_1.Player("Jack", 100);
    const player2 = new Player_1.Player("Kate", 200);
    const player3 = new Player_1.Player("Liam", 300);
    player1.addCard(new Card_1.Card("Hearts", "10"));
    player1.addCard(new Card_1.Card("Diamonds", "10"));
    player2.addCard(new Card_1.Card("Spades", "Ace"));
    player2.addCard(new Card_1.Card("Clubs", "5"));
    player3.addCard(new Card_1.Card("Hearts", "King"));
    player3.addCard(new Card_1.Card("Diamonds", "Queen"));
    const communityCards = [
        new Card_1.Card("Clubs", "10"),
        new Card_1.Card("Spades", "9"),
        new Card_1.Card("Hearts", "9"),
        new Card_1.Card("Diamonds", "2"),
        new Card_1.Card("Clubs", "3")
    ];
    const players = [player1, player2, player3];
    rankPlayers(players, communityCards);
};
const test5 = () => {
    console.log("Test 5: Full House vs Flush vs One Pair");
    const player1 = new Player_1.Player("Mike", 100);
    const player2 = new Player_1.Player("Nina", 200);
    const player3 = new Player_1.Player("Oscar", 300);
    player1.addCard(new Card_1.Card("Hearts", "Jack"));
    player1.addCard(new Card_1.Card("Diamonds", "Jack"));
    player2.addCard(new Card_1.Card("Spades", "2"));
    player2.addCard(new Card_1.Card("Spades", "7"));
    player3.addCard(new Card_1.Card("Clubs", "8"));
    player3.addCard(new Card_1.Card("Diamonds", "9"));
    const communityCards = [
        new Card_1.Card("Clubs", "Jack"),
        new Card_1.Card("Spades", "Queen"),
        new Card_1.Card("Spades", "King"),
        new Card_1.Card("Spades", "Ace"),
        new Card_1.Card("Hearts", "Queen")
    ];
    const players = [player1, player2, player3];
    rankPlayers(players, communityCards);
};
const test6 = () => {
    console.log("Test 6: Four of a Kind vs Full house vs Two Pair");
    const player1 = new Player_1.Player("Paul", 100);
    const player2 = new Player_1.Player("Quinn", 200);
    const player3 = new Player_1.Player("Rachel", 300);
    player1.addCard(new Card_1.Card("Hearts", "10"));
    player1.addCard(new Card_1.Card("Diamonds", "10"));
    player2.addCard(new Card_1.Card("Spades", "Jack"));
    player2.addCard(new Card_1.Card("Clubs", "Jack"));
    player3.addCard(new Card_1.Card("Hearts", "Queen"));
    player3.addCard(new Card_1.Card("Diamonds", "King"));
    const communityCards = [
        new Card_1.Card("Clubs", "10"),
        new Card_1.Card("Spades", "10"),
        new Card_1.Card("Hearts", "Jack"),
        new Card_1.Card("Diamonds", "Queen"),
        new Card_1.Card("Clubs", "2")
    ];
    const players = [player1, player2, player3];
    rankPlayers(players, communityCards);
};
const runtest = () => {
    test1();
    test2();
    test3();
    test4();
    test5();
    test6();
    // ultimate royal flush test
    runRoyalFlushTest();
};
runtest();
// runRoyalFlushTest()
