import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Thermometer, CloudRain, Sun, Cloud, Wind, Sunset, Flame } from 'lucide-react';
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
    const hasFireplace = venue.tags?.includes('Fireplace');

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

    // Calculate wind factor from API
    const getWindFactor = () => {
        if (!weather?.wind?.speed) return { label: 'Unknown', color: 'text-gray-500' };
        const windSpeed = weather.wind.speed; // m/s
        if (windSpeed < 3) return { label: 'Calm', color: 'text-green-600', icon: '🍃' };
        if (windSpeed < 6) return { label: 'Low Wind', color: 'text-green-500', icon: '🌿' };
        if (windSpeed < 10) return { label: 'Breezy', color: 'text-yellow-600', icon: '💨' };
        return { label: 'Windy', color: 'text-orange-500', icon: '🌬️' };
    };

    // Calculate sunshine hours remaining
    const getSunshineHours = () => {
        if (!weather?.sys?.sunset) return null;
        const now = new Date();
        const sunset = new Date(weather.sys.sunset * 1000);
        const diffMs = sunset - now;

        if (diffMs <= 0) return { hours: 0, label: 'Sun has set', icon: '🌙' };

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (hours === 0) {
            return { hours: 0, minutes, label: `${minutes}min of sun left`, icon: '🌅' };
        }
        return { hours, minutes, label: `~${hours}h ${minutes}m of sun remaining`, icon: '☀️' };
    };

    // Fireplace status logic
    const getFireplaceStatus = () => {
        if (!hasFireplace) return null;
        const temp = temperature || 20;
        const hour = new Date().getHours();

        if (temp < 15) {
            return { status: 'ON Now', color: 'text-orange-600', bgColor: 'bg-orange-100', active: true };
        } else if (temp < 20 && hour >= 17) {
            return { status: 'ON from 5PM', color: 'text-orange-500', bgColor: 'bg-orange-50', active: true };
        } else if (hour >= 18) {
            return { status: 'ON from 6PM', color: 'text-amber-600', bgColor: 'bg-amber-50', active: false };
        }
        return { status: 'Available evenings', color: 'text-gray-500', bgColor: 'bg-gray-50', active: false };
    };

    const windFactor = getWindFactor();
    const sunshineHours = getSunshineHours();
    const fireplaceStatus = getFireplaceStatus();

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
                        <div className={`relative bg-gradient-to-br ${cardBackground} backdrop-blur-xl rounded-t-3xl shadow-2xl border-t ${cardAccent} p-6 pb-8 max-h-[85vh] overflow-y-auto`}>
                            {/* Drag handle */}
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

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
                            <div className="text-5xl mb-3 text-center animate-float">
                                {venue.emoji}
                            </div>

                            {/* Venue name */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                                {venue.name}
                            </h2>

                            {/* Vibe */}
                            <p className="text-base text-gray-600 mb-3 text-center font-medium">
                                {venue.vibe}
                            </p>

                            {/* Address */}
                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                                <MapPin size={16} />
                                <span className="text-sm">{venue.address}</span>
                            </div>

                            {/* ===== WEATHER INTELLIGENCE SECTION ===== */}
                            <div className="bg-white/60 rounded-2xl p-4 mb-4 border border-white/50">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                                    Weather Intelligence
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Temperature */}
                                    {temperature !== null && (
                                        <div className="flex items-center gap-2 p-2 bg-white/70 rounded-xl">
                                            <Thermometer className="w-5 h-5 text-red-400" />
                                            <div>
                                                <p className="text-lg font-bold text-gray-800">{temperature}°C</p>
                                                <p className="text-xs text-gray-500">Right now</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Wind Factor */}
                                    <div className="flex items-center gap-2 p-2 bg-white/70 rounded-xl">
                                        <Wind className={`w-5 h-5 ${windFactor.color}`} />
                                        <div>
                                            <p className={`text-sm font-bold ${windFactor.color}`}>
                                                {windFactor.icon} {windFactor.label}
                                            </p>
                                            <p className="text-xs text-gray-500">Wind Factor</p>
                                        </div>
                                    </div>

                                    {/* Sunshine Hours */}
                                    {sunshineHours && (
                                        <div className="flex items-center gap-2 p-2 bg-white/70 rounded-xl col-span-2">
                                            <Sunset className="w-5 h-5 text-orange-400" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">
                                                    {sunshineHours.icon} {sunshineHours.label}
                                                </p>
                                                <p className="text-xs text-gray-500">Sunshine Hours</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fireplace Status */}
                                    {fireplaceStatus && (
                                        <div className={`flex items-center gap-2 p-2 ${fireplaceStatus.bgColor} rounded-xl col-span-2 border ${fireplaceStatus.active ? 'border-orange-300' : 'border-transparent'}`}>
                                            <Flame className={`w-5 h-5 ${fireplaceStatus.color}`} />
                                            <div>
                                                <p className={`text-sm font-bold ${fireplaceStatus.color}`}>
                                                    🔥 Fireplace: {fireplaceStatus.status}
                                                </p>
                                                <p className="text-xs text-gray-500">Cozy Mode</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Weather Description */}
                                <div className={`mt-3 p-3 rounded-xl ${theme === 'sunny' ? 'bg-amber-100/70' :
                                        theme === 'rainy' ? 'bg-blue-100/70' :
                                            'bg-gray-100/70'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <WeatherIcon />
                                        <p className="text-sm text-gray-700 font-medium">
                                            {weatherDescription}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sunstay Score */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <img src="/assets/sun-badge.jpg" alt="Score" className="w-5 h-5 rounded-full" />
                                        Sunstay Score
                                        {weather && (
                                            <span className="text-xs text-gray-400 font-normal">(Live)</span>
                                        )}
                                    </span>
                                    <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        {sunstayScore}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sunstayScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full bg-gradient-to-r ${getScoreColor(sunstayScore)} rounded-full`}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                                {venue.tags.map((tag, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 border border-gray-200"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Book Now button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3.5 bg-gradient-to-r ${getButtonGradient()} text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group`}
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
