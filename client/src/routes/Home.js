import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { LocationService } from '../services/LocationService';

function Home() {
    useEffect(() => {
        // This is where you can load data
        // Notice how we made a service to do so and am loading it here
        LocationService.findLocations()
            .then((payload) => {    // If successful - do this
                toast.info('Successfully loaded all location data. Check console.');
                console.log(JSON.stringify(payload));
            })
            .catch((err) => {   // If hit error - do this
                toast.error('' + err);
            });
    }, []);

    return (
        <div>
            <h1>
                hi!
            </h1>
        </div>
    )
}

export default Home;