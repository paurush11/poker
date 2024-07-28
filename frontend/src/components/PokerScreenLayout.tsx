import IndividualCard from "./IndividualCard"
import PokerSeat from "./PokerSeat"

const UpperArea: React.FC<UpperAreaProps> = ({
    firstUsername,
    secondUsername,
    playerIndex,
    firstUserFirstCard,
    firstUserSecondCard,
    secondUserFirstCard,
    secondUserSecondCard
}) => {
    return (
        <div className="flex min-w-[40vw]" style={{
            justifyContent: firstUsername && secondUsername ? "space-between" : "center"
        }}>
            {firstUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat cardName={firstUserFirstCard || "king_of_clubs2"} />
                    <PokerSeat cardName={firstUserSecondCard || "king_of_clubs2"} />
                </div>
                <div className="flex" style={{
                    color: playerIndex === 0 ? "hsl(var(--ring))" : "hsl(var(--warning))",
                    fontSize: playerIndex === 0 ? "1.5rem" : "1.125rem",
                    lineHeight: playerIndex === 0 ? "2rem" : "1.75rem",
                }}>
                    {firstUsername}
                </div>
            </div>}

            {secondUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat cardName={secondUserFirstCard || "king_of_clubs2"} />
                    <PokerSeat cardName={secondUserSecondCard || "king_of_clubs2"} />
                </div>
                <div className="flex" style={{
                    color: playerIndex === 1 ? "hsl(var(--ring))" : "hsl(var(--warning))",
                    fontSize: playerIndex === 1 ? "1.5rem" : "1.125rem",
                    lineHeight: playerIndex === 1 ? "2rem" : "1.75rem",
                }}>
                    {secondUsername}
                </div>
            </div>}
        </div>
    )
}
const LowerArea: React.FC<LowerAreaProps> = ({
    firstUsername,
    secondUsername,
    playerIndex,
    firstUserFirstCard,
    firstUserSecondCard,
    secondUserFirstCard,
    secondUserSecondCard
}) => {
    return (
        <div className="flex min-w-[40vw]" style={{
            justifyContent: firstUsername && secondUsername ? "space-between" : "center"
        }}>
            {firstUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat cardName={firstUserFirstCard || "king_of_clubs2"} />
                    <PokerSeat cardName={firstUserSecondCard || "king_of_clubs2"} />
                </div>
                <div className="flex" style={{
                    color: playerIndex === 0 ? "hsl(var(--ring))" : "hsl(var(--warning))",
                    fontSize: playerIndex === 0 ? "1.5rem" : "1.125rem",
                    lineHeight: playerIndex === 0 ? "2rem" : "1.75rem",
                }}>
                    {firstUsername}
                </div>
            </div>}

            {secondUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex gap-4">
                    <PokerSeat cardName={secondUserFirstCard || "king_of_clubs2"} />
                    <PokerSeat cardName={secondUserSecondCard || "king_of_clubs2"} />
                </div>
                <div className="flex" style={{
                    color: playerIndex === 1 ? "hsl(var(--ring))" : "hsl(var(--warning))",
                    fontSize: playerIndex === 1 ? "1.5rem" : "1.125rem",
                    lineHeight: playerIndex === 1 ? "2rem" : "1.75rem",
                }}>
                    {secondUsername}
                </div>
            </div>}
        </div>
    )
}
const PokerGameTableLayout: React.FC<PokerGameTableProps> = ({
    firstCard,
    secondCard,
    thirdCard,
    fourthCard,
    fifthCard,
    message
}) => {
    return (
        <div className="flex flex-1 justify-center items-center p-4"
            style={{
                height: "50vh",
                width: "60vw",
                borderRadius: "100px",
                backgroundColor: "#166229",
                border: "4px solid black"
            }}>

            <div className="flex flex-1 min-h-full justify-center border-border border-2  gap-2  " style={{
                borderRadius: "100px",
            }}>
                <div className="flex flex-1 flex-col  items-center justify-evenly p-10 gap-4 " style={{
                    borderRadius: "100px",
                }}>
                    <div className="flex">
                        <IndividualCard value={fifthCard} available={fifthCard !== ""} />
                        <IndividualCard value={fourthCard} available={fourthCard !== ""} />
                        <IndividualCard value={thirdCard} available={thirdCard !== ""} />
                        <IndividualCard value={secondCard} available={secondCard !== ""} />
                        <IndividualCard value={firstCard} available={firstCard !== ""} />
                    </div>

                    {message !== '' && <div className="flex text-warning text-2xl">{message}</div>}
                </div>

            </div>
        </div>
    );
}
interface PokerGameTableProps {
    firstCard: string;
    secondCard: string;
    thirdCard: string;
    fourthCard: string;
    fifthCard: string;
    message: string;
}
interface CenterAreaProps {
    firstUsername?: string;
    secondUsername?: string;
    playerIndex: number;
    firstUserFirstCard?: string;
    firstUserSecondCard?: string;
    secondUserFirstCard?: string;
    secondUserSecondCard?: string;
    centerTableFirstCard?: string;
    centerTableSecondCard?: string;
    centerTableThirdCard?: string;
    centerTableFourthCard?: string;
    centerTableFifthCard?: string;
    message: string;
}
interface LowerAreaProps {
    firstUsername?: string;
    secondUsername?: string;
    playerIndex: number;
    firstUserFirstCard?: string;
    firstUserSecondCard?: string;
    secondUserFirstCard?: string;
    secondUserSecondCard?: string;
}

interface UpperAreaProps {
    firstUsername?: string;
    secondUsername?: string;
    playerIndex: number;
    firstUserFirstCard?: string;
    firstUserSecondCard?: string;
    secondUserFirstCard?: string;
    secondUserSecondCard?: string;
}
const CenterArea: React.FC<CenterAreaProps> = ({
    firstUsername,
    secondUsername,
    playerIndex,
    firstUserFirstCard,
    firstUserSecondCard,
    secondUserFirstCard,
    secondUserSecondCard,
    centerTableFirstCard,
    centerTableSecondCard,
    centerTableThirdCard,
    centerTableFourthCard,
    centerTableFifthCard,
    message

}) => {
    return (
        <div className="flex gap-4">
            {firstUsername && <div className="flex flex-col justify-center items-center gap-4" >
                <div className="flex items-center gap-4 justify-center" >
                    <PokerSeat cardName={firstUserFirstCard || "king_of_clubs2"} />
                    <PokerSeat cardName={firstUserSecondCard || "king_of_clubs2"} />
                </div>
                <div className="flex" style={{
                    color: playerIndex === 0 ? "hsl(var(--ring))" : "hsl(var(--warning))",
                    fontSize: playerIndex === 0 ? "1.5rem" : "1.125rem",
                    lineHeight: playerIndex === 0 ? "2rem" : "1.75rem",
                }}>
                    {firstUsername}
                </div>
            </div>}

            <PokerGameTableLayout
                message={message}
                firstCard={centerTableFirstCard ?? ""}
                secondCard={centerTableSecondCard ?? ""}
                thirdCard={centerTableThirdCard ?? ""}
                fourthCard={centerTableFourthCard ?? ""}
                fifthCard={centerTableFifthCard ?? ""}
            />
            {secondUsername && <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex items-center gap-4 justify-center">
                    <PokerSeat cardName={secondUserFirstCard || "king_of_clubs2"} />
                    <PokerSeat cardName={secondUserSecondCard || "king_of_clubs2"} />
                </div>
                <div className="flex " style={{
                    color: playerIndex === 1 ? "hsl(var(--ring))" : "hsl(var(--warning))",
                    fontSize: playerIndex === 1 ? "1.5rem" : "1.125rem",
                    lineHeight: playerIndex === 1 ? "2rem" : "1.75rem",
                }}>
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