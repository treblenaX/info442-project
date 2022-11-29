import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LocationService from '../services/LocationService';

import Loading from '../components/Loading';
import Map from "../components/Map";
import HeaderBar from '../components/HeaderBar';
import BuildingInfo from '../components/BuildingInfo';

export default function Home() {
    const [reload, setReload] = useState(1);
    const [isLoaded, setLoaded] = useState(false);
    const [locationsData, setLocationsData] = useState([]);

    const [isBuildingInfoOpen, setBuildingInfoOpen] = useState(false);
    const [buildingInfo, setBuildingInfo] = useState();

    const loadAllData = async () => {
        try {
            // Locations Data
            const locationsPayload = await LocationService.findLocations()
            setLocationsData(locationsPayload);

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
                                        (isBuildingInfoOpen)
                                        ? 
                                        <BuildingInfo
                                            buildingInfo={buildingInfo}
                                            isBuildingInfoOpen={isBuildingInfoOpen}
                                        />
                                        :
                                        <></>
                                    }
                                    
                                </div>
                                <Map 
                                    locationsPayload={locationsData}
                                    handleSetBuildingInfoOpen={setBuildingInfoOpen}
                                    handleSetBuildingInfo={setBuildingInfo}
                                />
                            </div>

                        </main>
                    </div>
            }
        </div>
    )
}