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

const actionOptions = ["Fold", "Raise", "Call", "All In", "Check"]
const betOptions = [5, 10, 15, 25, 50, 100]

function PokerActionDrawer({
    me
}: {
    me: PlayerType | undefined
}) {
    const [selectedAction, setSelectedAction] = React.useState("")
    const [selectedBet, setSelectedBet] = React.useState(0)

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Take Action</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Poker Action</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="grid grid-cols-3 gap-2">
                            {actionOptions.map((action) => (
                                <Button
                                    key={action}
                                    variant={selectedAction === action ? "default" : "outline"}
                                    onClick={() => setSelectedAction(action)}
                                >
                                    {action}
                                </Button>
                            ))}
                        </div>
                        {(selectedAction === "Raise" || selectedAction === "Call") && (
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
                        <Button onClick={() => console.log(selectedAction, selectedBet)}>Submit</Button>
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