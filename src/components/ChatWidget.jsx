import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const ChatWidget = ({ isOpen, onClose, onFilterRooftops, onFindBeerGarden, onSurpriseMe }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "G'day! I'm Sunny. Looking for a rooftop or a heater today? ☀️",
        }
    ]);
    const [hasActed, setHasActed] = useState(false);

    const handleQuickReply = (action, displayText, responseText) => {
        if (hasActed) return;

        // Add user message
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'user',
            text: displayText
        }]);

        // Add bot response after delay
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: responseText
            }]);

            // Execute the action
            setTimeout(() => {
                action();
                setHasActed(true);
            }, 500);
        }, 600);
    };

    const quickReplies = [
        {
            text: "Find me a rooftop ☀️",
            response: "Great choice! Filtering the map to show Melbourne's best rooftops... 🏙️",
            action: onFilterRooftops
        },
        {
            text: "Where's the beer garden? 🍺",
            response: "Ah, a classic! Let me take you to Wonderland's famous beer garden... 🌿",
            action: onFindBeerGarden
        },
        {
            text: "Surprise me! 🎲",
            response: "Love the adventure! Let me pick something special for you... ✨",
            action: onSurpriseMe
        }
    ];

    const resetChat = () => {
        setMessages([{
            id: 1,
            type: 'bot',
            text: "G'day! I'm Sunny. Looking for a rooftop or a heater today? ☀️",
        }]);
        setHasActed(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-28 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]"
                >
                    {/* Chat window */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 shadow-md">
                                    <img
                                        src="/assets/sunny-mascot.jpg"
                                        alt="Sunny"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Sunny</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-white/80 text-xs">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${message.type === 'user'
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-br-md'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick replies */}
                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                            {!hasActed ? (
                                <div className="space-y-2">
                                    {quickReplies.map((reply, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleQuickReply(reply.action, reply.text, reply.response)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-all text-left flex items-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4 text-amber-500" />
                                            {reply.text}
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={resetChat}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                >
                                    <span>Ask Sunny Again</span>
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Speech bubble arrow */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-50 rotate-45 border-r border-b border-gray-100"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWidget;
