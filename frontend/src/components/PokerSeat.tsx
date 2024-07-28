import IndividualCard from "./IndividualCard";

interface PokerSeatProps {
    cardName: string;
}


const PokerSeat: React.FC<PokerSeatProps> = ({ cardName }) => {
    return (
        <div className="flex bg-red-700 rounded-md">
            <IndividualCard value={cardName} available={true} />
        </div>
    )
}

export default PokerSeat;