import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/index.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const ZOOM_THRESHOLD = 17 // zoom threshold for accessibility points

export default function Map(props) {
    const handleSetBuildingInfoID = props.handleSetBuildingInfoID;
    const handleSetShowBuildingInfo = props.handleSetShowBuildingInfo;
    const handleSetBuildingInfoRefresh = props.handleSetBuildingInfoRefresh;
    const handleSetShowFeatureInfo = props.handleSetShowFeatureInfo;
    const handleSetFeatureInfoRefresh = props.handleSetFeatureInfoRefresh;
    const locationsPayload = props.locationsPayload;
    const featuresPayload = props.featuresPayload;
    const setFeatureInfoID = props.setFeatureInfoID;
    const setNewFeatureCoords = props.setNewFeatureCoords;
    const setNewFeature = props.setNewFeature;
    const setSearchParams = props.setSearchParams;

    const mapContainer = useRef(null);
    const map = useRef(null);
    const zoom = props.startZoom;
    const lng = props.startLng;
    const lat = props.startLat;

    // populate building points
    useEffect(() => {

        // initialize map with defaults
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                    // When active the map will receive updates to the device's location as it changes.
                    trackUserLocation: true,
                    // Draw an arrow next to the location dot to indicate which direction the device is heading.
                    showUserHeading: true
                })
        );

        // if clicked, add marker to that location
        map.current.on('click', newFeature);
        // handler for zoom rendering changes
        map.current.on('zoom', zoomHandler);

        for (let i = 0; i < Object.keys(locationsPayload).length; i++) {     // iterate through all points
            let el = document.createElement('div');
            el.className = 'marker';

            let lat = locationsPayload[i]['latitude'];
            let long = locationsPayload[i]['longitude'];
            el.id = locationsPayload[i].id; // id param passed to marker
            el.addEventListener('click', buildingInfoHandler)
            el.id = locationsPayload[i].id

            new mapboxgl.Marker(el).setLngLat([lat, long]).addTo(map.current)
        }

        for (let i = 0; i < Object.keys(featuresPayload).length; i++) {     // iterate through all features
            let fa = document.createElement('div');
            fa.classList.add(featuresPayload[i].type);
            fa.classList.add('accessibility-marker');

            let lat = featuresPayload[i]['latitude'];
            let long = featuresPayload[i]['longitude'];
            fa.id = featuresPayload[i].id; // id param passed to marker
            fa.addEventListener('click', featureInfoHandler)

            new mapboxgl.Marker(fa).setLngLat([lat, long]).addTo(map.current)
        }

        // call zoomHandler once to initialize accessibility features being hidden
        zoomHandler()
    });

    async function newFeature(e) {
        let currZoom = map.current.getZoom();
        if(currZoom >= ZOOM_THRESHOLD) { // only allow new markers at zoom threshold
            if(!(checkMarker(e))){ // if marker already exists, do not create new one
                let coords = e.lngLat;
                flyTo(coords);
                newFeatureHandler(coords);
                addMarker(e);
            }
        } else {
            if(!(checkMarker(e))) {
                toast.error('You need to be zoomed in to add an accessibility feature!');
            }
            return
        }
    }

    function addMarker(e) {
        let newMarker = document.createElement('div');
        newMarker.classList.add('accessibility-marker');

        newMarker.addEventListener('click', featureInfoHandler);

        let coords = e.lngLat;
        let params = {
            lng: coords.lng,
            lat: coords.lat,
            zoom: map.current.getZoom()
        }

        setSearchParams(params);
    }

    // helper function, returns true if marker already exists at event location
    // else returns false
    function checkMarker(e) {
        return e.originalEvent.target.classList.contains('accessibility-marker') || e.originalEvent.target.classList.contains('marker');
    }

    // helper function that flys to center of event on map
    function flyTo(coords) {
        map.current.flyTo({     // center map on new marker
            center: coords,
            zoom: 18
        })
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

    async function buildingInfoHandler(e) {
        const locationID = e.currentTarget.id;

        toast.info('Loading building info... Please wait.');

        // open the modal
        handleSetBuildingInfoID(locationID);
        // refresh the building info data
        handleSetBuildingInfoRefresh(true);
        // show the modal
        handleSetShowBuildingInfo(true);
        // flyTo(e.target.lngLat);
    }

    async function featureInfoHandler(e) {
        const featureID = e.currentTarget.id;

        // open the modal
        setFeatureInfoID(featureID);
        handleSetShowFeatureInfo(true);
        handleSetFeatureInfoRefresh(true);
    }

    async function newFeatureHandler(coords) {
        setNewFeatureCoords(coords);
        setNewFeature(true)
    }

    return (
        <div className="map-section">
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}