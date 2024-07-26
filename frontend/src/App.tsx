import { Button } from "./components/ui/button"

function App() {


  return (
    <>
      <div className="flex min-h-screen flex-col items-center bg-foreground justify-center ">
        <div className="flex flex-col p-10 gap-4 items-center bg-background rounded-md">

          <div className="flex p-4 gap-6">
            <Button variant={"secondary"}>Join Room</Button>
            <Button variant={"secondary"}>Create Room</Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
