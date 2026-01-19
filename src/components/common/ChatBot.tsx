import { Button, Tooltip } from "flowbite-react";
import { RiRobot2Line } from "react-icons/ri";


export default function ChatBot() {
    return (
        <AIChatButton />
    )
}

const AIChatButton = () => {
    return (
        <Tooltip content="AI Assistant" placement="left">
            <Button
                aria-label="Open AI Assistant"
                className="rounded-full! w-16 h-16 p-0  bg-slate-900 hover:bg-slate-800 border-none shadow-2xl shadow-indigo-500/2 transition-all duration-300 ease-ou hover:scale-110 active:scale-95 hover:-translate-y- flex items-center justify-cente group"
            >
                <RiRobot2Line
                    className=" text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                    size={32}
                />
            </Button>
        </Tooltip>
    );
};