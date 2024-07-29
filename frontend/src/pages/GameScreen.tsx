import { PokerActionDrawer } from '@/components/PokerDrawer';
import { CenterArea, LowerArea, UpperArea } from '@/components/PokerScreenLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { fetchCards, sendJSONMessage } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

interface GameScreenProps {

}
type Task = "SMALL_BLIND" | "BIG_BLIND" | "CARD_DEAL" | "BET" | "PRE_FLOP"

interface Response {
    status: "success" | "error";
    message: string;
    data?: any;
    error?: string;
    code: number;
}

const actionCodeMap = new Map<number, string>([
    [1, "Player joined successfully"],
    [2, "Game started, All players are added, sorted and dealers have shuffled their cards"],
    [3, "Small blind update successful"],
    [4, "Big blind update successful"],
    [5, "Cards sent successfully"],
    [6, "Winner determined"],
    [7, "Bet placed successfully"],
    [400, "Invalid action"]
]);

export type PlayerType = {
    id: string;
    name: string;
    balance: number;
    addedTime: Date;
    hasFolded: boolean;
    hasChecked: boolean;
    hasDoneAllIn: boolean;
    hand: Card[];
    addCard: (card: Card) => void;
    fold: () => "folded";
    check: () => "checked";
    call: (amount: number) => "called";
    raise: (amount: number) => "raised";
    allIn: () => "all-in";
    bet: () => Promise<{ message: "bet", value: number }>;
    smallBlind: () => Promise<number>;
    bigBlind: (smallBindValue: number) => Promise<number>;
    askForAction: (currentBet: number) => Promise<{ message: "folded" | "called" | "raised" | "all-in" | "checked" | "bet" | "Invalid action", value: number }>;
    toString: () => string;
};
export type CardSuite = 'Spades' | 'Hearts' | 'Diamonds' | 'Clubs';
export type CardValue = 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King';


export type Card = {
    suite: CardSuite;
    value: CardValue;

}

const GameScreen: React.FC<GameScreenProps> = ({ }) => {

    const [players, setPlayers] = useState<string[]>([]);
    const [me, setMe] = useState<PlayerType>();
    const [error, setError] = useState<string>('');
    const [playerIndex, setPlayerIndex] = useState<number>(Number(sessionStorage.getItem('player_index')) || -1);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [centerTableCardNames, setCenterTableCardNames] = useState<string[]>([]);
    const [myCardNames, setMyCardNames] = useState<string[]>([]);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [message, setMessage] = useState('');
    const [isRiver, setIsRiver] = useState(false);
    const [isPreFlop, setIsPreFlop] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [currentStake, setCurrentStake] = useState(0);
    const [canIstart, setCanIstart] = useState(false);
    const { roomId } = useParams();
    const location = useLocation();
    const [responseMessage, setResponseMessage] = useState('');
    const playerId = location.state?.playerId;

    const roomJoinedMessage = JSON.stringify(sendJSONMessage('player-join', { roomId: roomId as string, playerId: playerId as string }));
    const gameStartMessage = JSON.stringify(sendJSONMessage('start-game', { roomId: roomId as string }));
    const moveToNextRound = () => {
        setIsPreFlop(false);
    }

    const startTheFuckingGame = (canIstart: boolean, amIEligible: boolean) => {
        if (canIstart && amIEligible) {
            setCanIstart(true);
        }
    }
    useEffect(() => {
        if (socket && canIstart) {
            console.log("sending message");
            socket.send(gameStartMessage);
        }
    }, [canIstart])

    const parseMessage = (message: Response) => {

        if (message.status === 'success') {
            switch (message.code) {

                case 1:
                    // refresh players
                    let players: PlayerType[] = message.data.players;
                    setMe(players.find((player: any) => player.id === playerId))
                    setPlayers(players.map((player: any) => player.name));
                    let amIEligible: boolean = false;
                    players.forEach((player: any, i) => {
                        if (player.id === playerId) {
                            setPlayerIndex(i);
                            if (i === 0) {
                                amIEligible = true;
                            }
                        }
                    });
                    let canStart = message.data.canStart as boolean;
                    startTheFuckingGame(canStart, amIEligible)
                    break;
                case 2:
                    let nextPlayerForSmallBlindId = message.data.nextPlayerId;
                    setIsStarted(true);
                    if (nextPlayerForSmallBlindId === playerId) {
                        setIsMyTurn(true)
                        setMessage('Choose small blind amount');
                    } else {
                        setMessage('');
                    }
                    break;
                case 3:
                    setIsStarted(true);
                    // small blind update successful
                    let nextPlayerForBigBlindId = message.data.nextPlayerId;
                    if (nextPlayerForBigBlindId === playerId) {
                        setIsMyTurn(true)
                        setMessage('Choose big blind amount');
                    } else {
                        setMessage('');
                    }
                    // now ask next player to bet big blind
                    break;
                case 4:
                    setIsStarted(true);
                    // ask player to bet
                    let nextPlayerForPreFlopId = message.data.nextPlayerId;
                    if (nextPlayerForPreFlopId === playerId) {
                        setIsMyTurn(true)
                        setIsPreFlop(true);
                        setMessage('Place your bet');
                    } else {
                        setMessage('');
                    }
                    break;
                case 5:
                    // get cards
                    break;
                case 6:
                    // winner determined
                    break;
                case 7:
                    setIsStarted(true);
                    // after first and every bet we have arrived here
                    const code = message.data.code;
                    if (code === 2 || code === 3 || code === 12) {
                        // 2 - every player has set the same money , so next round, so prev bet set is false,
                        // also pre flop is false because its only first round
                        // 3 - this player has folded also everyone has placed their bet so prev bet set is false and moved to next round
                        // 12 - this player has checked  prev bet set is false and moved to next round
                        moveToNextRound();
                    } else if (code === 9) {
                        // its call so obv prev bet is set

                    } else if (code === 7 || code === 8 || code === 10 || code === 11) {
                        // 7 this player has folded, so simple move to next player
                        // 8 means all in kia previous player ne, so move to next player
                        // 10 means bet
                        // 11 means check
                    }
                    let nextPlayerForBetId = message.data.nextPlayerId;
                    const currentBet = message.data.currentStake as string;
                    const playerCards = message.data.playerCards as string[];
                    if (nextPlayerForBetId === playerId) {
                        setIsMyTurn(true)
                        setMyCardNames(fetchCards(playerCards));
                        setMessage('Place your bet');
                    } else {
                        setMessage('');
                    }
                    const communityCards = message.data.communityCards as string[];
                    setCenterTableCardNames(fetchCards(communityCards));
                    setCurrentStake(Number(currentBet));

                    break;
                case 8:
                    break;

            }
        } else if (message.status === "error") {

            setError(message.message);
        }

    }

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3000');
        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
            newSocket.send(roomJoinedMessage);;
        };
        newSocket.onmessage = (event) => {
            console.log('Received message:', event.data);
            const message = JSON.parse(event.data);
            console.log('Received message:', message);
            parseMessage(message);
            // Handle incoming messages
        };
        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, [roomId, playerId]);

    // send response message
    useEffect(() => {
        if (socket) {
            socket.send(responseMessage);
        }
    }, [responseMessage])

    useEffect(() => {
        if (error)
            toast({
                title: "Error",
                description: error,
                variant: "destructive"
            })
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-emerald-900 to-green-600 justify-center gap-4 ">
            {players.length === 1 && <>
                <CenterArea
                    playerIndex={-1}
                    message={message}
                    centerTableFirstCard={centerTableCardNames.length > 0 ? centerTableCardNames[0] : ''}
                    centerTableSecondCard={centerTableCardNames.length > 1 ? centerTableCardNames[1] : ''}
                    centerTableThirdCard={centerTableCardNames.length > 2 ? centerTableCardNames[2] : ''}
                    centerTableFourthCard={centerTableCardNames.length > 3 ? centerTableCardNames[3] : ''}
                    centerTableFifthCard={centerTableCardNames.length > 4 ? centerTableCardNames[4] : ''}
                />
                <LowerArea
                    firstUsername={players[0]}
                    playerIndex={playerIndex === 0 ? 0 : -1}
                    firstUserFirstCard={myCardNames.length > 0 && playerIndex === 0 ? myCardNames[0] : ''}
                    firstUserSecondCard={myCardNames.length > 1 && playerIndex === 0 ? myCardNames[1] : ''}

                />
            </>}
            {players.length === 2 && (
                <>
                    <UpperArea
                        firstUsername={players[1]}
                        playerIndex={playerIndex === 1 ? 0 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 1 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 1 ? myCardNames[1] : ''}
                    />
                    <CenterArea
                        playerIndex={-1}
                        message={message}
                        centerTableFirstCard={centerTableCardNames.length > 0 ? centerTableCardNames[0] : ''}
                        centerTableSecondCard={centerTableCardNames.length > 1 ? centerTableCardNames[1] : ''}
                        centerTableThirdCard={centerTableCardNames.length > 2 ? centerTableCardNames[2] : ''}
                        centerTableFourthCard={centerTableCardNames.length > 3 ? centerTableCardNames[3] : ''}
                        centerTableFifthCard={centerTableCardNames.length > 4 ? centerTableCardNames[4] : ''}
                    />
                    <LowerArea
                        firstUsername={players[0]}
                        playerIndex={playerIndex === 0 ? 0 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 0 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 0 ? myCardNames[1] : ''}
                    />
                </>
            )}
            {players.length === 3 && (
                <>
                    <CenterArea
                        firstUsername={players[1]}
                        secondUsername={players[2]}
                        playerIndex={playerIndex === 2 ? 1 : playerIndex === 1 ? 0 : -1}
                        message={message}
                        centerTableFirstCard={centerTableCardNames.length > 0 ? centerTableCardNames[0] : ''}
                        centerTableSecondCard={centerTableCardNames.length > 1 ? centerTableCardNames[1] : ''}
                        centerTableThirdCard={centerTableCardNames.length > 2 ? centerTableCardNames[2] : ''}
                        centerTableFourthCard={centerTableCardNames.length > 3 ? centerTableCardNames[3] : ''}
                        centerTableFifthCard={centerTableCardNames.length > 4 ? centerTableCardNames[4] : ''}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 2 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 2 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 1 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 1 ? myCardNames[1] : ''}
                    />
                    <LowerArea
                        firstUsername={players[0]}
                        playerIndex={playerIndex === 0 ? 0 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 0 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 0 ? myCardNames[1] : ''}
                    />
                </>
            )}
            {players.length === 4 && (
                <>
                    <UpperArea
                        firstUsername={players[2]}
                        secondUsername={players[3]}
                        playerIndex={playerIndex === 2 ? 0 : playerIndex === 3 ? 1 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 2 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 2 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 3 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 3 ? myCardNames[1] : ''}
                    />
                    <CenterArea
                        playerIndex={-1}
                        message={message}
                        centerTableFirstCard={centerTableCardNames.length > 0 ? centerTableCardNames[0] : ''}
                        centerTableSecondCard={centerTableCardNames.length > 1 ? centerTableCardNames[1] : ''}
                        centerTableThirdCard={centerTableCardNames.length > 2 ? centerTableCardNames[2] : ''}
                        centerTableFourthCard={centerTableCardNames.length > 3 ? centerTableCardNames[3] : ''}
                        centerTableFifthCard={centerTableCardNames.length > 4 ? centerTableCardNames[4] : ''}
                    />
                    <LowerArea
                        firstUsername={players[0]}
                        secondUsername={players[1]}
                        playerIndex={playerIndex === 0 ? 0 : playerIndex === 1 ? 1 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 0 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 0 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 1 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 1 ? myCardNames[1] : ''}
                    />
                </>
            )}
            {players.length === 5 && (
                <>
                    <UpperArea
                        firstUsername={players[4]}
                        playerIndex={playerIndex === 4 ? 0 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 4 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 4 ? myCardNames[1] : ''}
                    />
                    <CenterArea
                        firstUsername={players[2]}
                        secondUsername={players[3]}
                        playerIndex={playerIndex === 2 ? 0 : playerIndex === 3 ? 1 : -1}
                        message={message}
                        centerTableFirstCard={centerTableCardNames.length > 0 ? centerTableCardNames[0] : ''}
                        centerTableSecondCard={centerTableCardNames.length > 1 ? centerTableCardNames[1] : ''}
                        centerTableThirdCard={centerTableCardNames.length > 2 ? centerTableCardNames[2] : ''}
                        centerTableFourthCard={centerTableCardNames.length > 3 ? centerTableCardNames[3] : ''}
                        centerTableFifthCard={centerTableCardNames.length > 4 ? centerTableCardNames[4] : ''}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 2 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 2 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 3 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 3 ? myCardNames[1] : ''}
                    />
                    <LowerArea
                        firstUsername={players[0]}
                        secondUsername={players[1]}
                        playerIndex={playerIndex === 0 ? 0 : playerIndex === 1 ? 1 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 0 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 0 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 1 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 1 ? myCardNames[1] : ''}
                    />
                </>
            )}
            {players.length === 6 && (
                <>
                    <UpperArea
                        firstUsername={players[4]}
                        secondUsername={players[5]}
                        playerIndex={playerIndex === 4 ? 0 : playerIndex === 5 ? 1 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 4 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 4 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 5 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 5 ? myCardNames[1] : ''}
                    />
                    <CenterArea
                        firstUsername={players[2]}
                        secondUsername={players[3]}
                        playerIndex={playerIndex === 2 ? 0 : playerIndex === 3 ? 1 : -1}
                        message={message}
                        centerTableFirstCard={centerTableCardNames.length > 0 ? centerTableCardNames[0] : ''}
                        centerTableSecondCard={centerTableCardNames.length > 1 ? centerTableCardNames[1] : ''}
                        centerTableThirdCard={centerTableCardNames.length > 2 ? centerTableCardNames[2] : ''}
                        centerTableFourthCard={centerTableCardNames.length > 3 ? centerTableCardNames[3] : ''}
                        centerTableFifthCard={centerTableCardNames.length > 4 ? centerTableCardNames[4] : ''}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 2 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 2 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 3 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 3 ? myCardNames[1] : ''}
                    />
                    <LowerArea
                        firstUsername={players[0]}
                        secondUsername={players[1]}
                        playerIndex={playerIndex === 0 ? 1 : playerIndex === 1 ? 1 : -1}
                        firstUserFirstCard={myCardNames.length > 0 && playerIndex === 0 ? myCardNames[0] : ''}
                        firstUserSecondCard={myCardNames.length > 1 && playerIndex === 0 ? myCardNames[1] : ''}
                        secondUserFirstCard={myCardNames.length > 0 && playerIndex === 1 ? myCardNames[0] : ''}
                        secondUserSecondCard={myCardNames.length > 1 && playerIndex === 1 ? myCardNames[1] : ''}
                    />
                </>
            )}

            {/* <UpperArea firstUsername='Player 1' secondUsername='Player2' playerIndex={playerIndex} />
            <CenterArea firstUsername='Player1' secondUsername='Player2' playerIndex={playerIndex} message={message} />
            <LowerArea firstUsername='Player1' secondUsername='Player2' playerIndex={playerIndex} /> */}
            <div className="flex">
                {isStarted && isMyTurn && <PokerActionDrawer
                    me={me}
                    roomId={roomId}
                    isPreFlop={isPreFlop}
                    isRiver={isRiver}
                    setResponseMessage={setResponseMessage}
                    message={message}
                    currentStake={currentStake}
                />}
            </div>
        </div>

    );
}

export default GameScreen;