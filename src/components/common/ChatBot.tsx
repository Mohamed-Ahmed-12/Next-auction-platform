import { Button } from "flowbite-react";
import { RiRobot2Line } from "react-icons/ri";
import { SiChatbot } from "react-icons/si";

export default function ChatBot() {
    return (
        <Button className="rounded-full w-15 h-15 p-0 border-0 hover:cursor-pointer hover:scale-105" color={"dark"}>
            <RiRobot2Line color="white" size={45}/>
        </Button>
    )
}