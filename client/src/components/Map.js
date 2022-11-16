import React, { useRef, useEffect, useState } from 'react';
import { LocationService } from '../services/LocationService';
import { toast } from 'react-toastify';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

let dummy_data = {
    location_type: 'BUILDING',
    address: '4060 George Washington Lane Northeast, Seattle, WA 98195',
    latitude: -122.31036845141246,
    longitude: 47.656471273388775,
    name: 'Odegaard Undergraduate Library',
    average_rating: 4.5,
    picture_urls: []
}

function DisplayMap()
{
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-122.30808827297321);
    const [lat, setLat] = useState(47.656708485813695);
    const [zoom, setZoom] = useState(14.5);

    // initialize map with defaults
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    });

    // populate building points
    useEffect(() => {
        LocationService.findLocations()
            .then((payload) => {    // If successful - do this
                for (let i = 0; i < Object.keys(payload).length; i++) {     // iterate through all points
                    let el = document.createElement('div');
                    el.className = 'marker';
                    let lat = payload[i]['latitude']
                    let long = payload[i]['longitude']

                    let marker = new mapboxgl.Marker(el).setLngLat([lat, long])
                    marker.addTo(map.current);
                }
                toast.info('Successfully loaded all location data. Check console.');
            })
            .catch((err) => {   // If hit error - do this
                toast.error('' + err);
            });
    })

    return (
        <div ref={mapContainer} className="map-container" />
    );
}

export default DisplayMap