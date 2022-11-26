import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { LocationService } from '../services/LocationService';

import Map from "../components/Map";
import HeaderBar from '../components/HeaderBar';

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
         
                <header>
                    <HeaderBar />
                </header>
                
                <main>
                    <div>
                        <Map />
                    </div>  
                </main>
         
        </div>
    )
}

export default Home;