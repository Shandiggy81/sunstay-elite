import React, { useState, Component, useRef, useCallback } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import WeatherBackground from './components/WeatherBackground';
import MapView from './components/MapView';
import VenueCard from './components/VenueCard';
import SunnyMascot from './components/SunnyMascot';
import ChatWidget from './components/ChatWidget';
import { motion } from 'framer-motion';
import { venues } from './data/venues';

// Loading fallback component
const LoadingScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 flex items-center justify-center">
        <div className="text-center">
            <motion.img
                src="/assets/sun-badge.jpg"
                alt="Loading"
                className="w-24 h-24 rounded-full mx-auto mb-4 shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white text-xl font-bold">Loading Sunstay...</p>
        </div>
    </div>
);

const WeatherIndicator = () => {
    const { weather, loading, theme } = useWeather();

    const getWeatherIcon = () => {
        switch (theme) {
            case 'sunny':
                return <img src="/assets/sun-badge.jpg" alt="Sunny" className="w-8 h-8 rounded-full" />;
            case 'rainy':
                return <img src="/assets/rain-cloud.jpg" alt="Rainy" className="w-8 h-8 rounded-full" />;
            default:
                return <img src="/assets/sun-badge.jpg" alt="Weather" className="w-8 h-8 rounded-full opacity-60" />;
        }
    };

    if (loading || !weather) {
        return (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <img src="/assets/sun-badge.jpg" alt="Weather" className="w-8 h-8 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-500">--°C</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full"
        >
            {getWeatherIcon()}
            <span className="text-sm font-semibold text-gray-700">
                {Math.round(weather.main.temp)}°C
            </span>
        </motion.div>
    );
};

const AppContent = () => {
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [filteredVenueIds, setFilteredVenueIds] = useState(null); // null = show all
    const mapRef = useRef(null);

    const handleVenueSelect = (venue) => {
        setSelectedVenue(venue);
    };

    const handleCloseCard = () => {
        setSelectedVenue(null);
    };

    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    // Chat action: Filter to rooftops only
    const handleFilterRooftops = useCallback(() => {
        const rooftopVenues = venues.filter(v =>
            v.vibe.toLowerCase().includes('rooftop') ||
            v.tags.includes('Rooftop') ||
            v.tags.includes('Views')
        );
        setFilteredVenueIds(rooftopVenues.map(v => v.id));
        setSelectedVenue(null);

        // Close chat after a moment
        setTimeout(() => {
            setIsChatOpen(false);
        }, 1500);
    }, []);

    // Chat action: Find beer garden (Wonderland)
    const handleFindBeerGarden = useCallback(() => {
        const beerGarden = venues.find(v => v.name === 'Wonderland');
        if (beerGarden) {
            setFilteredVenueIds(null); // Show all venues
            setSelectedVenue(beerGarden);

            // Pan to the venue if map ref is available
            if (mapRef.current && mapRef.current.flyTo) {
                mapRef.current.flyTo({
                    center: [beerGarden.lng, beerGarden.lat],
                    zoom: 16,
                    duration: 1500
                });
            }
        }

        setTimeout(() => {
            setIsChatOpen(false);
        }, 1500);
    }, []);

    // Chat action: Surprise me - random venue
    const handleSurpriseMe = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * venues.length);
        const randomVenue = venues[randomIndex];

        setFilteredVenueIds(null); // Show all venues
        setSelectedVenue(randomVenue);

        // Pan to the venue if map ref is available
        if (mapRef.current && mapRef.current.flyTo) {
            mapRef.current.flyTo({
                center: [randomVenue.lng, randomVenue.lat],
                zoom: 15,
                duration: 1500
            });
        }

        setTimeout(() => {
            setIsChatOpen(false);
        }, 1500);
    }, []);

    // Clear filter function
    const handleClearFilter = () => {
        setFilteredVenueIds(null);
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Weather-driven background */}
            <WeatherBackground />

            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-0 left-0 right-0 z-20 p-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <motion.img
                                src="/assets/sun-badge.jpg"
                                alt="Sunstay"
                                className="w-12 h-12 rounded-full shadow-lg"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <div>
                                <h1 className="text-2xl font-black gradient-text">Sunstay</h1>
                                <p className="text-xs text-gray-600 font-medium">Find Your Perfect Spot</p>
                            </div>
                        </div>

                        {/* Weather indicator */}
                        <WeatherIndicator />
                    </div>
                </div>
            </motion.header>

            {/* Filter indicator */}
            {filteredVenueIds && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-28 left-1/2 -translate-x-1/2 z-20"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">
                            🏙️ Showing {filteredVenueIds.length} rooftop venues
                        </span>
                        <button
                            onClick={handleClearFilter}
                            className="text-xs font-bold text-orange-500 hover:text-orange-600 ml-2"
                        >
                            Clear
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Main content - Map */}
            <motion.main
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute inset-0 pt-28 pb-8 px-6"
            >
                <div className="max-w-7xl mx-auto h-full">
                    <MapView
                        onVenueSelect={handleVenueSelect}
                        selectedVenue={selectedVenue}
                        filteredVenueIds={filteredVenueIds}
                        mapRef={mapRef}
                    />
                </div>
            </motion.main>

            {/* Venue detail card */}
            <VenueCard venue={selectedVenue} onClose={handleCloseCard} />

            {/* Chat widget */}
            <ChatWidget
                isOpen={isChatOpen}
                onClose={closeChat}
                onFilterRooftops={handleFilterRooftops}
                onFindBeerGarden={handleFindBeerGarden}
                onSurpriseMe={handleSurpriseMe}
            />

            {/* Sunny mascot FAB */}
            <SunnyMascot onClick={toggleChat} isChatOpen={isChatOpen} />

            {/* Footer badge */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute bottom-6 left-6 z-20"
            >
                <div className="glass-dark rounded-full px-4 py-2 text-white text-xs font-semibold flex items-center gap-2">
                    <img src="/assets/fire-icon.jpg" alt="" className="w-4 h-4 rounded" />
                    Elite Demo • 22 Venues
                </div>
            </motion.div>
        </div>
    );
};

// Error boundary component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center p-6">
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center">
                        <div className="text-6xl mb-4">😢</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
                        <p className="text-gray-600 mb-4">Something went wrong loading Sunstay.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    return (
        <ErrorBoundary>
            <WeatherProvider>
                <AppContent />
            </WeatherProvider>
        </ErrorBoundary>
    );
}

export default App;
