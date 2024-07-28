import IndividualCard from "./IndividualCard";

const PokerSeat: React.FC = () => {
    return (
        <div className="flex bg-red-700 rounded-md">
            <IndividualCard value='queen_of_spades2' available={true} />
        </div>
    )
}

export default PokerSeat;