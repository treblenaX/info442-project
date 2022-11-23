import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LocationService } from '../services/LocationService';

import DisplayMap from "../components/Map";
import DisplayLoading from '../components/Loading';

export default function Home() {
    const [isLoaded, setLoaded] = useState(false);
    const [locationsData, setLocationsData] = useState([]);

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
            .catch((e) => toast.error('' + e));
    }, []);

    return (
        <div>
            {
                !isLoaded   // If the data is not loaded, then display the loading thing
                    ? <DisplayLoading />
                    : 
                    <div>
                        <DisplayMap
                            locationsPayload={locationsData}
                        />
                    </div>
            }
        </div>
    )
}