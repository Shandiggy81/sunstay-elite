import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, MAP_STYLE, INITIAL_VIEW_STATE } from '../config/mapConfig';
import { venues } from '../data/venues';

const MapView = ({ onVenueSelect, selectedVenue }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (map.current) return; // Initialize map only once

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
            zoom: INITIAL_VIEW_STATE.zoom,
            pitch: INITIAL_VIEW_STATE.pitch,
            bearing: INITIAL_VIEW_STATE.bearing,
        });

        map.current.on('load', () => {
            setMapLoaded(true);
            addVenueMarkers();
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => {
            markers.current.forEach(marker => marker.remove());
            map.current.remove();
        };
    }, []);

    // Fly to venue when selected
    useEffect(() => {
        if (selectedVenue && map.current) {
            map.current.flyTo({
                center: [selectedVenue.lng, selectedVenue.lat],
                zoom: 15,
                duration: 1500,
                essential: true,
            });
        }
    }, [selectedVenue]);

    const addVenueMarkers = () => {
        venues.forEach((venue) => {
            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'venue-marker';
            el.innerHTML = `
        <div class="venue-marker-pill">
          <span class="venue-emoji">${venue.emoji}</span>
        </div>
      `;

            // Add click event
            el.addEventListener('click', () => {
                onVenueSelect(venue);
            });

            // Create and add marker
            const marker = new mapboxgl.Marker(el)
                .setLngLat([venue.lng, venue.lat])
                .addTo(map.current);

            markers.current.push(marker);
        });
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden shadow-2xl" />

            {/* Loading overlay */}
            {!mapLoaded && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="text-center">
                        <div className="animate-spin-slow text-6xl mb-4">☀️</div>
                        <p className="text-gray-600 font-semibold">Loading Sunstay Map...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
