import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import React, { useState } from 'react'
import { validateInputs } from '../lib/Interfaces';
import { useNavigate } from 'react-router-dom';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({ }) => {
    const { toast } = useToast()
    const navigate = useNavigate();
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
        setLoading(true);
        try {
            const data = {
                numberOfPlayers: numberOfPlayers,
                username: username,
                balance: balance
            }
            const response = await axios.post("http://localhost:3000/create-room", data);
            console.log(response);
            if (response && response.status === 200) {
                // Handle success
                console.log('Room created successfully:', response.data);
                toast({
                    title: "Room created successfully",
                    description: response.data.message,
                    variant: "success"
                })
                setTimeout(() => {
                    navigate(`/game/${response.data.data.roomId}`, { state: { playerId: response.data.data.playerId } });
                }, 1500);

            } else {


                console.error('Unexpected response', response);
                toast({
                    title: "Error creating room",
                    description: response.data.message,
                    variant: "destructive"
                })

            }

        } catch (e: any) {
            console.error(e);
            let errorMsg = `Error creating room :- ${e}`;
            toast({
                title: "Error creating room",
                description: errorMsg,
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    }
    const joinRoom = async () => {
        setLoading(true);
        try {
            const data = {
                roomId: roomId,
                username: username,
                balance: balance
            }
            const response = await axios.post("http://localhost:3000/join-room", data);
            if (response && response.status === 200) {
                // Handle success
                console.log('Room joined successfully:', response.data);
                toast({
                    title: "Room joined successfully",
                    description: response.data.message,
                    variant: "success"
                })
                setTimeout(() => {
                    navigate(`/game/${response.data.data.roomId}`, { state: { playerId: response.data.data.playerId } });
                }, 1500);

            } else {

                console.error('Unexpected response', response);
                toast({
                    title: "Error creating room",
                    description: response.data.message,
                    variant: "destructive"
                })

            }


        } catch (e) {
            console.error(e);
            let errorMsg = `Error creating room :- ${e}`;
            toast({
                title: "Error creating room",
                description: errorMsg,
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    }
    const clearError = () => {
        setErrorMessage("")
    }

    return (
        <>
            <div className="flex min-h-screen flex-col items-center bg-foreground justify-center ">
                <div className="flex flex-col p-10 gap-4 items-center bg-background rounded-md">
                    {<Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />}
                    {<Input type="number" placeholder="Balance" value={balance} onChange={(e) => setBalance(parseInt(e.target.value) ?? 0)} />}
                    {createRoomSelected && <Input type="number" placeholder="No of People" value={numberOfPlayers} onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setNumberOfPlayers(value)
                        if (value < 2) setErrorMessage("Atleast 2 players are required")
                        else if (value > 6) setErrorMessage("Maximum 6 players are allowed")
                        else {
                            setErrorMessage("")
                        }
                    }} />}
                    {!createRoomSelected}
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {!createRoomSelected && <Input type="text" placeholder="Room Id" value={roomId} onChange={(e) => setRoomId(e.target.value)} />}
                    <div className="flex p-4 gap-6">
                        {<Button
                            onClick={() => {
                                setCreateRoomSelected(false)
                            }}
                            disabled={loading}
                            className="w-full"
                            variant={loading ? "ghost" : "secondary"}
                        >
                            Join Room
                        </Button>}
                        {<Button
                            onClick={() => {
                                setCreateRoomSelected(true)
                            }}
                            disabled={loading}
                            className="w-full"
                            variant={loading ? "ghost" : "secondary"}>
                            Create Room
                        </Button>}
                    </div>
                    <div className="flex p-4 gap-6">
                        {<Button onClick={async () => {
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
                                    return;
                                }

                                await createRoom()
                                setLoading(false)
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
                        }
                        {errorMessage && <Button
                            variant={"destructive"}
                            onClick={async () => {
                                setBalance(undefined)
                                setRoomId("")
                                setUsername("")
                                setNumberOfPlayers(undefined)
                                setErrorMessage("")
                                setLoading(false)
                            }}> Reset</Button>}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home;