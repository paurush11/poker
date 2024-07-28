import IndividualCard from "./IndividualCard"
import PokerSeat from "./PokerSeat"

const UpperArea: React.FC<UpperAreaProps> = ({
    firstUsername,
    secondUsername
}) => {
    return (
        <div className="flex min-w-[40vw]" style={{
            justifyContent: firstUsername && secondUsername ? "space-between" : "center"
        }}>
            {firstUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat />
                    <PokerSeat />
                </div>
                <div className="text-warning text-lg">
                    {firstUsername}
                </div>
            </div>}

            {secondUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat />
                    <PokerSeat />
                </div>
                <div className="text-warning text-lg">
                    {secondUsername}
                </div>
            </div>}
        </div>
    )
}
const LowerArea: React.FC<LowerAreaProps> = ({
    firstUsername,
    secondUsername
}) => {
    return (
        <div className="flex min-w-[40vw]" style={{
            justifyContent: firstUsername && secondUsername ? "space-between" : "center"
        }}>
            {firstUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat />
                    <PokerSeat />
                </div>
                <div className="text-warning text-lg">
                    {firstUsername}
                </div>
            </div>}

            {secondUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat />
                    <PokerSeat />
                </div>
                <div className="text-warning text-lg">
                    {secondUsername}
                </div>
            </div>}
        </div>
    )
}
const PokerGameTableLayout: React.FC = () => {
    return (
        <div className="flex flex-1 justify-center items-center p-4"
            style={{
                height: "50vh",
                width: "60vw",
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
interface CenterAreaProps {
    firstUsername?: string;
    secondUsername?: string;
}
interface LowerAreaProps {
    firstUsername?: string;
    secondUsername?: string;
}

interface UpperAreaProps {
    firstUsername?: string;
    secondUsername?: string;
}
const CenterArea: React.FC<CenterAreaProps> = ({ firstUsername, secondUsername }) => {
    return (
        <div className="flex gap-4">
            {firstUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex items-center gap-4 justify-center">
                    <PokerSeat />
                    <PokerSeat />
                </div>
                <div className="flex text-warning text-lg">
                    {firstUsername}
                </div>
            </div>}

            <PokerGameTableLayout />
            {secondUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex items-center gap-4 justify-center">
                    <PokerSeat />
                    <PokerSeat />
                </div>
                <div className="flex text-warning text-lg">
                    {secondUsername}
                </div>
            </div>}

        </div>
    )
}


export {
    UpperArea,
    LowerArea,
    PokerGameTableLayout,
    CenterArea
}