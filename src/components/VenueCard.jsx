import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const VenueCard = ({ venue, onClose }) => {
    const { calculateSunstayScore, getFireplaceMode } = useWeather();

    if (!venue) return null;

    const sunstayScore = calculateSunstayScore(venue);
    const isFireplaceMode = getFireplaceMode();

    // Score color gradient
    const getScoreColor = (score) => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 60) return 'from-yellow-400 to-amber-500';
        return 'from-orange-400 to-red-500';
    };

    return (
        <AnimatePresence>
            {venue && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    />

                    {/* Bottom sheet card */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl"
                    >
                        <div className="relative bg-white/90 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-white/20 p-6 pb-8">
                            {/* Drag handle */}
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                            {/* Emoji icon */}
                            <div className="text-6xl mb-4 text-center animate-float">
                                {venue.emoji}
                            </div>

                            {/* Venue name */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                                {venue.name}
                            </h2>

                            {/* Vibe */}
                            <p className="text-lg text-gray-600 mb-4 text-center font-medium">
                                {venue.vibe}
                            </p>

                            {/* Address */}
                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
                                <MapPin size={18} />
                                <span className="text-sm">{venue.address}</span>
                            </div>

                            {/* Sunstay Score */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <img src="/assets/sun-badge.jpg" alt="Score" className="w-6 h-6 rounded-full" />
                                        Sunstay Score
                                    </span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        {sunstayScore}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sunstayScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full bg-gradient-to-r ${getScoreColor(sunstayScore)} rounded-full`}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                                {venue.tags.map((tag, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 border border-purple-300/30"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Fireplace Mode indicator */}
                            {isFireplaceMode && venue.tags.includes('Fireplace') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30 flex items-center justify-center gap-3"
                                >
                                    <img src="/assets/fire-icon.jpg" alt="Fire" className="w-10 h-10 rounded-lg" />
                                    <span className="text-sm font-semibold text-orange-900">
                                        Fireplace Mode Active - Perfect for Today!
                                    </span>
                                </motion.div>
                            )}

                            {/* Book Now button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
                            >
                                <span className="relative z-10">Book Now</span>
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VenueCard;
