import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import React, { useState } from 'react'
import { validateInputs } from '../lib/Interfaces';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({ }) => {
    const { toast } = useToast()
    const [createRoomSelected, setCreateRoomSelected] = useState(true);
    const [roomId, setRoomId] = useState<string>("");
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [username, setUsername] = useState<string>("");
    const [numberOfPlayers, setNumberOfPlayers] = useState<number | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const validateInputs = ({ type, createRoom, joinRoom }: validateInputs) => {
        if (type === "join") {
            if (!joinRoom) {
                setErrorMessage("Join room inputs are required");
                return false;
            }
            if (!joinRoom.roomId) {
                setErrorMessage("Room ID is required");
                return false;
            }
            if (!joinRoom.username) {
                setErrorMessage("Username is required");
                return false;
            }
            if (!joinRoom.balance) {
                setErrorMessage("Balance is required");
                return false;
            }
            if (isNaN(joinRoom.balance)) {
                setErrorMessage("Balance should be a number");
                return false;
            }
            if (joinRoom.balance < 0 || joinRoom.balance > 100000) {
                setErrorMessage("Balance should be between 0 and 100000");
                return false;
            }
            if (joinRoom.username.length < 3 || joinRoom.username.length > 20) {
                setErrorMessage("Username should be between 3 and 20 characters");
                return false;
            }
            return true;
        } else {
            if (!createRoom) {
                setErrorMessage("Create room inputs are required");
                return false;
            }
            if (!createRoom.username) {
                setErrorMessage("Username is required");
                return false;
            }
            if (!createRoom.balance) {
                setErrorMessage("Balance is required");
                return false;
            }
            if (isNaN(createRoom.balance)) {
                setErrorMessage("Balance should be a number");
                return false;
            }
            if (createRoom.balance < 0 || createRoom.balance > 100000) {
                setErrorMessage("Balance should be between 0 and 100000");
                return false;
            }
            if (createRoom.username.length < 3 || createRoom.username.length > 20) {
                setErrorMessage("Username should be between 3 and 20 characters");
                return false;
            }
            if (!createRoom.numberOfPlayers) {
                setErrorMessage("Number of players is required");
                return false;
            }
            if (createRoom.numberOfPlayers < 2 || createRoom.numberOfPlayers > 6) {
                setErrorMessage("Number of players should be between 2 and 6");
                return false;
            }
            return true;
        }
    }

    const createRoom = async () => {
        try {

            const data = {
                numberOfPlayers: 2,
                username: username,
                balance: balance
            }
            const response = await axios.post("http://localhost:3000/create-room", data);
            if (response && response.status === 200) {
                // Handle success
                console.log('Room created successfully:', response.data);
                toast({
                    title: "Room created successfully",
                    description: response.data.message,
                    variant: "success"
                })
                // return {
                //   success: true,
                //   message: response.data.message,
                //   roomId: response.data.data.roomId
                // };
            } else {
                // This else block may not be necessary if all errors are caught in catch block
                console.error('Unexpected response', response);
                toast({
                    title: "Error creating room",
                    description: response.data.message,
                    variant: "destructive"
                })
                // return { success: false, message: 'Unexpected server response' };
            }

        } catch (e) {
            let errorMsg = `Error creating room :- ${e}`;
            toast({
                title: "Error creating room",
                description: errorMsg,
                variant: "destructive"
            })
        }
    }
    const joinRoom = async () => {
        try {

        } catch (e) {
            console.log(e)
        }
    }
    const clearError = () => {
        setErrorMessage("")
    }

    const inputForName = () => {
        return (
            <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        )
    }
    const inputForRoomId = () => {
        return (
            <Input type="text" placeholder="Room Id" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        )
    }
    const inputForBalance = () => {
        return (
            <Input type="number" placeholder="Balance" value={balance} onChange={(e) => setBalance(parseInt(e.target.value) ?? 0)} />
        )
    }
    const inputForNumberOfPlayers = () => {
        return (
            <Input type="number" placeholder="No of People" value={numberOfPlayers} onChange={(e) => {
                const value = parseInt(e.target.value)
                setNumberOfPlayers(value)
                if (value < 2) setErrorMessage("Atleast 2 players are required")
                else if (value > 6) setErrorMessage("Maximum 6 players are allowed")
                else {
                    setErrorMessage("")
                }
            }} />
        )
    }

    const createRoomButton = () => {
        return (
            <Button
                onClick={() => {
                    setCreateRoomSelected(true)
                }}
                disabled={loading}
                className="w-full"
                variant={loading ? "ghost" : "secondary"}>
                Create Room
            </Button>
        )
    }
    const joinRoomButton = () => {
        return (
            <Button
                onClick={() => {
                    setCreateRoomSelected(false)
                }}
                disabled={loading}
                className="w-full"
                variant={loading ? "ghost" : "secondary"}
            >
                Join Room
            </Button>
        )
    }
    const finalSubmitButton = () => {
        return (
            <Button onClick={async () => {
                setLoading(true)
                clearError()

                if (createRoomSelected) {
                    const result = validateInputs({
                        type: "create",
                        createRoom: {
                            balance: balance,
                            username: username,
                            numberOfPlayers: numberOfPlayers
                        }
                    })
                    if (!result) {
                        setLoading(false)
                        return
                    }

                    await createRoom()
                } else {
                    const result = validateInputs({
                        type: "join",
                        joinRoom: {
                            balance: balance,
                            username: username,
                            roomId: roomId
                        }
                    })
                    if (!result) {
                        setLoading(false)
                        return
                    }
                    await joinRoom()
                }
            }}> Submit</Button>
        )
    }
    const reset = () => {
        return (
            <Button
                variant={"destructive"}
                onClick={async () => {
                    setBalance(undefined)
                    setRoomId("")
                    setUsername("")
                    setNumberOfPlayers(undefined)
                    setErrorMessage("")
                    setLoading(false)
                }}> Reset</Button>
        )
    }
    return (
        <>
            <div className="flex min-h-screen flex-col items-center bg-foreground justify-center ">
                <div className="flex flex-col p-10 gap-4 items-center bg-background rounded-md">
                    {inputForName()}
                    {inputForBalance()}
                    {createRoomSelected && inputForNumberOfPlayers()}
                    {!createRoomSelected}
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {!createRoomSelected && inputForRoomId()}
                    <div className="flex p-4 gap-6">
                        {joinRoomButton()}
                        {createRoomButton()}
                    </div>
                    <div className="flex p-4 gap-6">
                        {finalSubmitButton()}
                        {errorMessage && reset()}
                    </div>



                </div>
            </div>
        </>
    )
}

export default Home;