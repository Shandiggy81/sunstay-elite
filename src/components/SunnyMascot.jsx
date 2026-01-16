import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SunnyMascot = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="fixed bottom-6 right-6 z-30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.5 }}
        >
            <motion.button
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50"
                    animate={{
                        scale: isHovered ? 1.5 : 1,
                        opacity: isHovered ? 0.7 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Sunny mascot image */}
                <motion.img
                    src="/assets/sunny-mascot.jpg"
                    alt="Sunny"
                    className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white/50"
                    animate={{
                        rotate: isHovered ? 15 : 0,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                    }}
                />
            </motion.button>

            {/* Tooltip */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                className="absolute right-24 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
            >
                <p className="text-sm font-semibold text-gray-800">
                    Hey! I'm Sunny 😎
                </p>
            </motion.div>
        </motion.div>
    );
};

export default SunnyMascot;
