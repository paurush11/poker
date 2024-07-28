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

export default IndividualCard;