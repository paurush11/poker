import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { PlayerType } from "@/pages/GameScreen"
import { sendJSONMessage } from "@/lib/utils"

const actionOptions = ["Fold", "Raise", "Call", "All In", "Check", "Bet"]
const betOptions = [5, 10, 15, 25, 50, 100]

function PokerActionDrawer({
    me,
    roomId,
    isRiver,
    isPreFlop,
    message,
    setResponseMessage,
    currentStake
}: {
    me: PlayerType | undefined
    roomId: string | undefined
    isRiver: boolean,
    isPreFlop: boolean
    message: string
    setResponseMessage: React.Dispatch<React.SetStateAction<string>>
    currentStake: number
}) {
    const [selectedAction, setSelectedAction] = React.useState("")
    const [selectedBet, setSelectedBet] = React.useState(0)
    const [betMessage, setBetMessage] = React.useState<"call" | "raise" | "all-in" | "fold" | "check" | "bet" | "nothing">("nothing")
    const smallBlindMessage = sendJSONMessage('small-binding-update', { smallBlindValue: selectedBet })
    const bigBlindMessage = sendJSONMessage('big-blind-update', { bigBlindValue: selectedBet })
    const betMessageResponse = sendJSONMessage('bet', { betValue: selectedBet, betMessage: betMessage, isPreFlop: isPreFlop, isRiver: isRiver })

    const validateResponse = (): boolean => {
        if (message === "Choose small blind amount" || message === "Choose big blind amount") {
            if (!me || !me.balance || me.balance <= 0 || selectedBet === 0 || selectedBet > me?.balance) {
                return false;
            }
        } else if (message === "Place your bet") {
            if (!me || !me.balance || me.balance <= 0 || selectedBet === 0 || selectedBet > me?.balance || !betMessage || betMessage.length === 0 || betMessage === "nothing") {
                return false;
            }
        }
        return true;
    }
    const onSubmit = () => {
        const isValid = validateResponse();
        if (!isValid) return;
        if (message === "Choose small blind amount") {
            setResponseMessage(JSON.stringify(smallBlindMessage));
        } else if (message === "Choose big blind amount") {
            setResponseMessage(JSON.stringify(bigBlindMessage));
        } else if (message === "Place your bet") {
            setResponseMessage(JSON.stringify(betMessageResponse));
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Take Action</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>
                            <div className="flex justify-between items-center">
                                Poker Action
                                {me && <div className="flex">{me.balance}</div>}
                            </div>
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="grid grid-cols-3 gap-2">
                            {actionOptions.map((action) => (
                                <Button
                                    key={action}
                                    variant={selectedAction === action ? "default" : "outline"}
                                    onClick={() => {
                                        setSelectedAction(action)
                                        if (action === "Fold") {
                                            setBetMessage("fold")
                                        } else if (action === "Raise") {
                                            setBetMessage("raise")
                                        } else if (action === "Call") {
                                            setBetMessage("call")
                                        } else if (action === "All In") {
                                            setBetMessage("all-in")
                                        } else if (action === "Check") {
                                            setBetMessage("check")
                                        } else if (action === "Bet") {
                                            setBetMessage("bet")
                                        }
                                    }}
                                >
                                    {action}
                                </Button>
                            ))}
                        </div>
                        {(selectedAction === "Raise" || selectedAction === "Bet") && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {betOptions.map((bet) => (
                                    <Button
                                        key={bet}
                                        variant={selectedBet === bet ? "default" : "outline"}
                                        onClick={() => setSelectedBet(bet)}
                                    >
                                        ${bet}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <Button onClick={() => {
                            onSubmit();
                        }}>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
export {
    PokerActionDrawer
}