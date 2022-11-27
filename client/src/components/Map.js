import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const ZOOM_THRESHOLD = 17 // zoom threshold for accessibility points

export default function DisplayMap(props) {
    const locationsPayload = props.locationsPayload;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-122.30808827297321);
    const [lat, setLat] = useState(47.656708485813695);
    const [zoom, setZoom] = useState(14.5);

    // populate building points
    useEffect(() => {
        // initialize map with defaults
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        // call zoomHandler once to initialize accessibility features being hidden
        zoomHandler()

        // if clicked, add marker to that location
        map.current.on('click', addMarker);
        // handler for zoom rendering changes
        map.current.on('zoom', zoomHandler);

        for (let i = 0; i < Object.keys(locationsPayload).length; i++) {     // iterate through all points
            let el = document.createElement('div');
            el.className = 'marker';

            let lat = locationsPayload[i]['latitude']
            let long = locationsPayload[i]['longitude']

            new mapboxgl.Marker(el).setLngLat([lat, long]).addTo(map.current)
        }
    });

    function addMarker(e) {
        let currZoom = map.current.getZoom();
        if(currZoom >= ZOOM_THRESHOLD) { // only allow new markers at zoom threshold
            let newMarker = document.createElement('div');
            newMarker.className = 'accessibility-marker';

            new mapboxgl.Marker(newMarker).setLngLat(e.lngLat).addTo(map.current);
        } else {
            // TODO: add some sort of error message
            return
        }
    }

    function zoomHandler() {
        let currZoom = map.current.getZoom();
        let accessibilityPoints = document.getElementsByClassName('accessibility-marker');
        if(currZoom >= ZOOM_THRESHOLD) { // zoom threshold for displaying accessibility feature points
            for(let i = 0; i < accessibilityPoints.length; i++) {
                accessibilityPoints[i].style.display = "inline"
            }
        } else {
            for(let i = 0; i < accessibilityPoints.length; i++) {
                accessibilityPoints[i].style.display = "none"
            }
        }
    }

    return (
        <div ref={mapContainer} className="map-container" />
    );
}