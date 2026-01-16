import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WeatherContext = createContext(null);

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        // Return default values instead of throwing to prevent crashes
        return {
            weather: null,
            loading: true,
            theme: 'sunny',
            getBackgroundGradient: () => 'from-amber-400 via-orange-400 to-yellow-500',
            calculateSunstayScore: () => 75,
            getFireplaceMode: () => false,
        };
    }
    return context;
};

export const WeatherProvider = ({ children }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('sunny'); // default theme

    const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
    const MELBOURNE_COORDS = { lat: -37.8136, lon: 144.9631 };

    useEffect(() => {
        fetchWeather();
        // Refresh weather every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchWeather = async () => {
        // Skip API call if no valid key is set
        if (!WEATHER_API_KEY) {
            console.log('Weather API key not configured, using default sunny theme');
            setTheme('sunny');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${MELBOURNE_COORDS.lat}&lon=${MELBOURNE_COORDS.lon}&appid=${WEATHER_API_KEY}&units=metric`
            );

            const weatherData = response.data;
            setWeather(weatherData);

            // Determine theme based on weather condition
            const condition = weatherData.weather[0].main.toLowerCase();
            const newTheme = getThemeFromCondition(condition);
            setTheme(newTheme);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather:', error);
            // Fallback to sunny theme if API fails
            setTheme('sunny');
            setLoading(false);
        }
    };

    const getThemeFromCondition = (condition) => {
        if (condition.includes('rain') || condition.includes('drizzle')) {
            return 'rainy';
        } else if (condition.includes('cloud')) {
            return 'cloudy';
        } else {
            return 'sunny';
        }
    };

    const getBackgroundGradient = () => {
        switch (theme) {
            case 'sunny':
                return 'from-amber-400 via-orange-400 to-yellow-500';
            case 'rainy':
                return 'from-slate-700 via-blue-900 to-indigo-900';
            case 'cloudy':
                return 'from-gray-400 via-slate-500 to-gray-600';
            default:
                return 'from-amber-400 via-orange-400 to-yellow-500';
        }
    };

    const calculateSunstayScore = (venue) => {
        if (!weather) return 75; // default score

        const temp = weather.main.temp;
        const condition = weather.weather[0].main.toLowerCase();

        let score = 50; // base score

        // Temperature scoring (optimal 18-26°C)
        if (temp >= 18 && temp <= 26) {
            score += 30;
        } else if (temp >= 15 && temp < 18) {
            score += 20;
        } else if (temp > 26 && temp <= 30) {
            score += 20;
        } else if (temp > 30) {
            score += 10;
        } else {
            score += 5;
        }

        // Weather condition scoring
        if (condition.includes('clear') || condition.includes('sun')) {
            score += 20;
        } else if (condition.includes('cloud')) {
            score += 10;
        } else if (condition.includes('rain')) {
            // Rainy weather - boost for cozy/fireplace venues
            if (venue && venue.tags && (venue.tags.includes('Fireplace') || venue.tags.includes('Cozy'))) {
                score += 15;
            } else {
                score -= 20;
            }
        }

        // Venue-specific bonuses
        if (venue && venue.tags) {
            if (theme === 'sunny' && venue.tags.includes('Sunny')) {
                score += 10;
            }
            if (theme === 'rainy' && venue.tags.includes('Fireplace')) {
                score += 15;
            }
        }

        // Clamp score between 0-100
        return Math.max(0, Math.min(100, score));
    };

    const getFireplaceMode = () => {
        return theme === 'rainy';
    };

    const value = {
        weather,
        loading,
        theme,
        getBackgroundGradient,
        calculateSunstayScore,
        getFireplaceMode,
    };

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
};
