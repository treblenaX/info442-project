import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { LocationService } from '../services/LocationService';

import Map from "../components/Map";

function Home() {

    return (
        <div>
            <h1>
                hi!
            </h1>
            <Map />
        </div>
    )
}

export default Home;