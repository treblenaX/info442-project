import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LocationService from '../services/LocationService';
import FeatureService from '../services/FeatureService';
import Loading from '../components/Loading';
import Map from "../components/Map";
import HeaderBar from '../components/HeaderBar';
import BuildingInfo from '../components/BuildingInfo';
import FeatureInfo from '../components/FeatureInfo.js';
import NewFeature from '../components/NewFeature.js';

export default function Home() {
    const [reload, setReload] = useState(1);
    const [isLoading, setLoading] = useState(true);

    const [locationsData, setLocationsData] = useState([]);
    const [featuresData, setFeaturesData] = useState([]);

    const [buildingInfoID, setBuildingInfoID] = useState();
    const [showBuildingInfo, setShowBuildingInfo] = useState(false);
    const [buildingInfoRefresh, setBuildingInfoRefresh] = useState(false);

    const [showFeatureInfo, setShowFeatureInfo] = useState(false);
    const [newFeatureID, setNewFeatureID] = useState();
    const [featureInfoID, setFeatureInfoID] = useState();
    const [newFeatureCoords, setNewFeatureCoords] = useState();
    const [newFeature, setNewFeature] = useState();
    const [featureInfoRefresh, setFeatureInfoRefresh] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const [lng, setLng] = useState(-122.30808827297321);
    const [lat, setLat] = useState(47.656708485813695);
    const [zoom, setZoom] = useState(14.5);

    const loadAllData = async () => {
        try {
            // Locations Data + feature data for map
            const locationsPayload = await LocationService.findLocations()
            const featuresPayload = await FeatureService.findFeatures()
            setLocationsData(locationsPayload);
            setFeaturesData(featuresPayload);

            setLoading(false);
        } catch (err) {
            throw new Error('Cannnot load Home data: ' + err);
        }
    }

    useEffect(() => {
        // if params exist, set map view to those params
        if(searchParams.has("lng") && searchParams.has("lat") && searchParams.has("zoom")) {
            setLng(searchParams.get("lng"));
            setLat(searchParams.get("lat"));
            setZoom(searchParams.get("zoom"));
        }
        loadAllData()
            .catch((e) => {
                toast.error('' + e.message);
                setTimeout(() => {
                    setReload((prev) => (prev > 1000) ? 0 : prev + 1);
                }, 5000);
            });
    }, [reload]);

    return (
        <div>
            {
                isLoading   // If the data is not loaded, then display the loading thing
                    ? <Loading />
                    : 
                    <div>
                        <header>
                            <HeaderBar 
                                isHome={true}
                            />
                        </header>
                        <main>
                            <div>
                                <div>
                                    {
                                        (buildingInfoID)
                                        ? 
                                        <BuildingInfo
                                            handleSetShowBuildingInfo={setShowBuildingInfo}
                                            handleSetBuildingInfoRefresh={setBuildingInfoRefresh}
                                            locationID={buildingInfoID}
                                            showBuildingInfo={showBuildingInfo}
                                            buildingInfoRefresh={buildingInfoRefresh}
                                        />
                                        :
                                        <></>
                                    }
                                    {
                                        (featureInfoID)
                                        ?
                                        <FeatureInfo
                                            featureID={featureInfoID}
                                            setShowFeatureInfo={setShowFeatureInfo}
                                            setFeatureInfoRefresh={setFeatureInfoRefresh}
                                            showFeatureInfo={showFeatureInfo}
                                            featureInfoRefresh={featureInfoRefresh}
                                        />
                                        :
                                        <></>
                                    }
                                    <NewFeature
                                        coords={newFeatureCoords}
                                        active={newFeature}
                                        setActive={setNewFeature}
                                        setNewFeatureID={setNewFeatureID}
                                    />
                                </div>
                                <Map
                                    setBuildingInfoID={setBuildingInfoID}
                                    setFeatureInfoID={setFeatureInfoID}
                                    featureID={featureInfoID}
                                    newFeatureID={newFeatureID}
                                    setNewFeatureCoords={setNewFeatureCoords}
                                    setNewFeature={setNewFeature}
                                    locationsPayload={locationsData}
                                    handleSetBuildingInfoID={setBuildingInfoID}
                                    handleSetShowFeatureInfo={setShowFeatureInfo}
                                    handleSetShowBuildingInfo={setShowBuildingInfo}
                                    handleSetBuildingInfoRefresh={setBuildingInfoRefresh}
                                    handleSetFeatureInfoRefresh={setFeatureInfoRefresh}
                                    featuresPayload={featuresData}
                                    setSearchParams={setSearchParams}
                                    startLat={lat}
                                    startLng={lng}
                                    startZoom={zoom}
                                />
                            </div>
                        </main>
                    </div>
            }
        </div>
    )
}