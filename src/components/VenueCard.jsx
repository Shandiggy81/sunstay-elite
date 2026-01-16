import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Thermometer, CloudRain, Sun, Cloud } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const VenueCard = ({ venue, onClose }) => {
    const {
        calculateSunstayScore,
        getFireplaceMode,
        getTemperature,
        getWeatherDescription,
        getCardBackground,
        getCardAccent,
        theme,
        weather
    } = useWeather();

    if (!venue) return null;

    const sunstayScore = calculateSunstayScore(venue);
    const isFireplaceMode = getFireplaceMode();
    const temperature = getTemperature();
    const weatherDescription = getWeatherDescription(venue);
    const cardBackground = getCardBackground();
    const cardAccent = getCardAccent();

    // Score color gradient
    const getScoreColor = (score) => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 60) return 'from-yellow-400 to-amber-500';
        return 'from-orange-400 to-red-500';
    };

    // Weather icon based on theme
    const WeatherIcon = () => {
        switch (theme) {
            case 'rainy':
                return <CloudRain className="w-5 h-5 text-blue-500" />;
            case 'cloudy':
                return <Cloud className="w-5 h-5 text-gray-500" />;
            default:
                return <Sun className="w-5 h-5 text-amber-500" />;
        }
    };

    // Get button gradient based on weather
    const getButtonGradient = () => {
        switch (theme) {
            case 'rainy':
                return 'from-blue-500 via-indigo-500 to-purple-500';
            case 'cloudy':
                return 'from-slate-500 via-gray-500 to-slate-600';
            default:
                return 'from-yellow-400 via-orange-500 to-pink-500';
        }
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
                        <div className={`relative bg-gradient-to-br ${cardBackground} backdrop-blur-xl rounded-t-3xl shadow-2xl border-t ${cardAccent} p-6 pb-8`}>
                            {/* Drag handle */}
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                            {/* Live Weather Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full shadow-md border border-white/50"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-gray-600">LIVE</span>
                            </motion.div>

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

                            {/* Live Weather Description - NEW */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`mb-5 p-4 rounded-2xl flex items-center gap-3 ${theme === 'sunny' ? 'bg-amber-100/70 border border-amber-200/50' :
                                        theme === 'rainy' ? 'bg-blue-100/70 border border-blue-200/50' :
                                            'bg-gray-100/70 border border-gray-200/50'
                                    }`}
                            >
                                <div className="flex-shrink-0 p-2 rounded-xl bg-white/70 shadow-sm">
                                    <WeatherIcon />
                                </div>
                                <div className="flex-1">
                                    {temperature !== null && (
                                        <div className="flex items-center gap-1 mb-1">
                                            <Thermometer className="w-4 h-4 text-gray-500" />
                                            <span className="text-xl font-bold text-gray-800">{temperature}°C</span>
                                            <span className="text-sm text-gray-500 ml-2">in Melbourne</span>
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-700 font-medium">
                                        {weatherDescription}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Address */}
                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-5">
                                <MapPin size={18} />
                                <span className="text-sm">{venue.address}</span>
                            </div>

                            {/* Sunstay Score */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <img src="/assets/sun-badge.jpg" alt="Score" className="w-6 h-6 rounded-full" />
                                        Sunstay Score
                                        {weather && (
                                            <span className="text-xs text-gray-400 font-normal">(Live)</span>
                                        )}
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
                                <p className="text-xs text-gray-500 mt-1.5 text-center">
                                    {sunstayScore >= 80 ? "Excellent conditions right now!" :
                                        sunstayScore >= 60 ? "Good vibes expected" :
                                            "Check venue amenities for comfort"}
                                </p>
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
                                        🔥 Fireplace Mode Active - Perfect for Today!
                                    </span>
                                </motion.div>
                            )}

                            {/* Book Now button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 bg-gradient-to-r ${getButtonGradient()} text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group`}
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
