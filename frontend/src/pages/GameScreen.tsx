import { PokerActionDrawer } from '@/components/PokerDrawer';
import { CenterArea, LowerArea, UpperArea } from '@/components/PokerScreenLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

interface GameScreenProps {

}

interface Response {
    status: "success" | "error";
    message: string;
    data?: any;
    error?: string;
    code: number;
}


const sendJSONMessage = (action: string, payload: { [key: string]: string | number }) => {
    return {
        action: action,
        payload: payload
    }
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
    const [username, setUsername] = useState(sessionStorage.getItem('username') || 'Player1');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isYourTurn, setIsYourTurn] = useState(false);
    const { roomId } = useParams();
    const location = useLocation();
    const playerId = location.state?.playerId;

    const roomJoinedMessage = JSON.stringify(sendJSONMessage('player-join', { roomId: roomId as string, playerId: playerId as string }));
    const parseMessage = (message: Response) => {

        if (message.status === 'success') {
            switch (message.code) {
                case 1:
                    // refresh players
                    let players: PlayerType[] = message.data.players;
                    setMe(players.find((player: any) => player.id === playerId))
                    setPlayers(players.map((player: any) => player.name));
                    players.forEach((player: any) => {
                        if (player.id === playerId) {
                            setUsername(player.name);
                        }
                    });
                    break;
                case 2:
                    let sortedPlayers = message.data.sortedPlayers;
                    if (sortedPlayers[0].id === playerId) {
                        // ask something
                    }
                    // ask sortedPlayers[0] to bet small blind
                    break;
                case 3:
                    if (sortedPlayers[1].id === playerId) {
                        // ask something
                    }
                    // now ask next player to bet big blind
                    break;
                case 4:
                    // ask player to bet
                    break;
                case 5:
                    // get cards
                    break;
                case 6:
                    // winner determined
                    break;
                case 7:
                    // move to next player
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

    const distributePlayers = () => {

    }
    useEffect(() => {
        if (error)
            toast({
                title: "Error",
                description: error,
                variant: "destructive"
            })
    }, [error]);
    useEffect(() => {
        console.log(players)
    }, [players, setPlayers])
    console.log(players)
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-emerald-900 to-green-600 justify-center gap-4 ">
            {players.length === 1 && <>
                <CenterArea />
                <LowerArea firstUsername={players[0]} />
            </>}
            {players.length === 2 && (
                <>
                    <UpperArea firstUsername={players[1]} />
                    <CenterArea />
                    <LowerArea firstUsername={players[0]} />
                </>
            )}
            {players.length === 3 && (
                <>
                    <CenterArea firstUsername={players[1]} secondUsername={players[2]} />
                    <LowerArea firstUsername={players[0]} />
                </>
            )}
            {players.length === 4 && (
                <>
                    <UpperArea firstUsername={players[2]} secondUsername={players[3]} />
                    <CenterArea />
                    <LowerArea firstUsername={players[0]} secondUsername={players[1]} />
                </>
            )}
            {players.length === 5 && (
                <>
                    <UpperArea firstUsername={players[4]} />
                    <CenterArea firstUsername={players[2]} secondUsername={players[3]} />
                    <LowerArea firstUsername={players[0]} secondUsername={players[1]} />
                </>
            )}
            {players.length === 6 && (
                <>
                    <UpperArea firstUsername={players[4]} secondUsername={players[5]} />
                    <CenterArea firstUsername={players[2]} secondUsername={players[3]} />
                    <LowerArea firstUsername={players[0]} secondUsername={players[1]} />
                </>
            )}
            {/* 
            <UpperArea firstUsername='Player 1' secondUsername='Player2' />
            <CenterArea firstUsername='Player1' secondUsername='Player2' />
            <LowerArea firstUsername='Player1' secondUsername='Player2' /> */}
            <div className="flex">
                <PokerActionDrawer me={me} />
            </div>
        </div>

    );
}

export default GameScreen;