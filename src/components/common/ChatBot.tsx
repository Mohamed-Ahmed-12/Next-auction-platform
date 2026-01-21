"use client";

import { Button, Modal, ModalBody, ModalHeader, TextInput, Tooltip } from "flowbite-react";
import { useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function ChatBot() {
    return <AIChatButton />;
}

const AIChatButton = () => {
    const [openModal, setOpenModal] = useState(false);
    const msgInput = useRef<HTMLInputElement>(null);

    const handleClose = () => setOpenModal(false);

    return (
        <>
            <Tooltip content="AI Assistant" placement="left">
                <Button
                    aria-label="Open AI Assistant"
                    className="rounded-full! w-16 h-16 p-0  bg-slate-900 hover:bg-slate-800 border-none shadow-2xl shadow-indigo-500/2 transition-all duration-300 ease-ou hover:scale-110 active:scale-95 hover:-translate-y- flex items-center justify-cente group" onClick={() => setOpenModal(true)}
                >
                    <RiRobot2Line
                        className="text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                        size={32}
                    />
                </Button>
            </Tooltip>
            <ChatBotModal openModal={openModal} handleCloseModal={handleClose} msgInput={msgInput} />
        </>
    );
};

type ChatBotModalProps = {
    openModal: boolean;
    handleCloseModal: () => void;
    msgInput: any;
};

function ChatBotModal({ openModal, handleCloseModal, msgInput }: ChatBotModalProps) {
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", text: input }]);
        setInput("");
        // Simulated AI response (replace with API call)
        setTimeout(() => {
            setMessages((prev) => [...prev, { role: "ai", text: "Hello 👋 How can I assist you today?" }]);
        }, 600);
    };

    return (
        <Modal show={openModal} size="lg" popup onClose={handleCloseModal}>
            <ModalHeader>
                <div className="flex items-center gap-2">
                    <RiRobot2Line size={24} className="text-indigo-600" />
                    <span className="font-semibold">AI Assistant</span>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className="flex flex-col h-96 bg-gray-50">
                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-3 rounded-md">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start items-start gap-2"}`}
                            >
                                {msg.role === "ai" && (
                                    <div className="flex-shrink-0">
                                        <RiRobot2Line className="text-indigo-500" size={20} />
                                    </div>
                                )}
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow-sm ${msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-ee-none"
                                            : "bg-white border border-gray-200 text-gray-900 rounded-es-none"
                                        }`}
                                >
                                    {msg.role === "ai" && (
                                        <span className="block text-xs text-indigo-500 font-medium mb-1">AI</span>
                                    )}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <p className="text-center text-gray-400 text-sm">Start the conversation…</p>
                        )}
                    </div>

                    {/* Input bar */}
                    <div className="flex items-center gap-2 mt-3">
                        <TextInput
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your message..."
                            className="flex-grow rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                        <Button color="indigo" onClick={handleSend} className="flex items-center gap-1">
                            <FiSend /> Send
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}
