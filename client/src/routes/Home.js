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
    const [isLoaded, setLoaded] = useState(false);
    const [locationsData, setLocationsData] = useState([]);
    const [featuresData, setFeaturesData] = useState([]);

    const [buildingInfoID, setBuildingInfoID] = useState();
    const [featureInfoID, setFeatureInfoID] = useState();
    const [newFeatureCoords, setNewFeatureCoords] = useState();
    const [newFeature, setNewFeature] = useState();

    const loadAllData = async () => {
        try {
            // Locations Data + feature data for map
            const locationsPayload = await LocationService.findLocations()
            const featuresPayload = await FeatureService.findFeatures()
            setLocationsData(locationsPayload);
            setFeaturesData(featuresPayload);

            setLoaded(true);
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
                !isLoaded   // If the data is not loaded, then display the loading thing
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
                                            locationID={buildingInfoID}
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
                                    featuresPayload={featuresData}
                                />
                            </div>
                        </main>
                    </div>
            }
        </div>
    )
}