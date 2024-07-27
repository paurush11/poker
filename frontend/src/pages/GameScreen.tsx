import { Button } from '@/components/ui/button';
import React from 'react'
import { useParams } from 'react-router-dom';
interface GameScreenProps {

}
interface IndividualCardProps {
    value: string,
    available: boolean
}
const IndividualCard: React.FC<IndividualCardProps> = ({ value, available }) => {
    const url = `/SVG-cards-1.3/${value}.svg`;
    return (
        <div className="flex flex-shrink-0 border-2 p-2 border-border  rounded-md hover:shadow-md hover:shadow-border" style={{
            height: "12vh",
            width: "5vw"
        }}>
            {available && <img src={url} alt={value} />}
        </div>
    );
}
const PokerGameLayout: React.FC = () => {
    return (
        <div className="flex flex-1 justify-center items-center p-4"
            style={{
                height: "60vh",
                width: "70vw",
                borderRadius: "100px",
                backgroundColor: "#166229",
                border: "4px solid black"
            }}>
            <div className="flex flex-1 min-h-full justify-center border-border border-2 items-center gap-2 " style={{
                borderRadius: "100px",
            }}>
                <IndividualCard value='queen_of_spades2' available={true} />
                <IndividualCard value='queen_of_spades2' available={true} />
                <IndividualCard value='queen_of_spades2' available={true} />
                <IndividualCard value='queen_of_spades2' available={true} />
                <IndividualCard value='queen_of_spades2' available={true} />
            </div>
        </div>
    );
}
const PokerSeat: React.FC = () => {
    return (
        <div className="flex bg-red-700 rounded-md">
            <IndividualCard value='queen_of_spades2' available={true} />
        </div>
    )
}
const UpperArea: React.FC = () => {
    return (<div className="flex justify-between min-w-[40vw]">
        <div className="flex gap-4">
            <PokerSeat />
            <PokerSeat />
        </div>
        <div className="flex gap-4">
            <PokerSeat />
            <PokerSeat />
        </div>
    </div>)
}
const LowerArea: React.FC = () => {
    return (
        <div className="flex justify-between min-w-[40vw]">
            <div className="flex gap-4">
                <PokerSeat />
                <PokerSeat />
            </div>
            <div className="flex gap-4">
                <PokerSeat />
                <PokerSeat />
            </div>
        </div>
    )
}
const CenterArea: React.FC = () => {
    return (
        <div className="flex gap-4">
            <div className="flex items-center gap-4">
                <PokerSeat />
                <PokerSeat />
            </div>
            <PokerGameLayout />
            <div className="flex items-center gap-4">
                <PokerSeat />
                <PokerSeat />
            </div>

        </div>
    )
}
const fetchRoomDetails = () => {
    
}
const GameScreen: React.FC<GameScreenProps> = ({ }) => {
    const { roomId } = useParams();
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-emerald-900 to-green-600 justify-center gap-4 ">
            <UpperArea />
            <CenterArea />
            <LowerArea />
            <div className="flex">
                <Button variant={"secondary"}>Make Move</Button>
            </div>
        </div>

    );
}

export default GameScreen;