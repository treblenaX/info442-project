import React, { useEffect } from 'react';
import { LocationService } from '../services/LocationService';

function Home() {
    useEffect(() => {
        // This is where you can load data
        LocationService.findLocations().then((payload) => {
            console.log(payload);
        });
    }, [])
    return (
        <div>
            <h1>
                hi!
            </h1>
        </div>
    )
}

export default Home;