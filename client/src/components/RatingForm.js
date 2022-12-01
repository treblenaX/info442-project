import React, { useEffect, useState } from 'react';

export default function RatingForm(props) {
    const averageRating = props.averageRating;

    const [isLoading, setLoading] = useState(false);


    useEffect(() => {

    }, [])
    return (
        <div>
            <h3>
                {`Rating: ${averageRating}`}
            </h3>
        </div>
    );
}