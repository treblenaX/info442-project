import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LocationService from '../services/LocationService';
import FeatureService from '../services/FeatureService';
import Loading from '../components/Loading';
import Map from "../components/Map";
import HeaderBar from '../components/HeaderBar';
import BuildingInfo from '../components/BuildingInfo';
import FeatureInfo from '../components/FeatureInfo';
import NewFeature from '../components/NewFeature';

export default function Home() {
    const [reload, setReload] = useState(1);
    const [isLoading, setLoading] = useState(true);
    const [locationsData, setLocationsData] = useState([]);
    const [featuresData, setFeaturesData] = useState([]);

    const [buildingInfoID, setBuildingInfoID] = useState();
    const [featureInfoID, setFeatureInfoID] = useState();
    const [newFeatureCoords, setNewFeatureCoords] = useState();
    const [newFeature, setNewFeature] = useState();
    const [showBuildingInfo, setShowBuildingInfo] = useState(false);
    const [buildingInfoRefresh, setBuildingInfoRefresh] = useState(false);

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
                                        />
                                        :
                                        <></>
                                    }
                                    <NewFeature
                                        coords={newFeatureCoords}
                                        active={newFeature}
                                        setActive={setNewFeature}
                                    />
                                </div>
                                <Map
                                    setBuildingInfoID={setBuildingInfoID}
                                    setFeatureInfoID={setFeatureInfoID}
                                    setNewFeatureCoords={setNewFeatureCoords}
                                    setNewFeature={setNewFeature}
                                    locationsPayload={locationsData}
                                    handleSetBuildingInfoID={setBuildingInfoID}
                                    handleSetShowBuildingInfo={setShowBuildingInfo}
                                    handleSetBuildingInfoRefresh={setBuildingInfoRefresh}
                                    featuresPayload={featuresData}
                                />
                            </div>
                        </main>
                    </div>
            }
        </div>
    )
}