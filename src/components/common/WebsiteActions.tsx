import ProgressArrow from "./Arrow";
import ChatBot from "../common/ChatBot";

export default function WebSiteActions() {
    return (
        <div className="fixed right-6 end-2 bottom-6 flex flex-col gap-y-2 z-50">
            <ProgressArrow />
            <ChatBot />
        </div>
    )
}