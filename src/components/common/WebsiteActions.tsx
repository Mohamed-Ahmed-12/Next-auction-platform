import ProgressArrow from "./Arrow";
import ChatBot from "../common/ChatBot";

export default function WebSiteActions() {
    return (
        <div className="fixed end-2 bottom-4 flex flex-col gap-y-2 z-50">
            <ProgressArrow />
            <ChatBot />
        </div>
    )
}