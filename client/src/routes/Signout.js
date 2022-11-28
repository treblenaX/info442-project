import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import LoginService from '../services/LoginService';

export default function Signout() {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await LoginService.logout();

            navigate('/');
        } catch (e) {
            toast.error('' + e);
        }
    }

    useEffect(() => {
        handleSignout();
    }, [])
    return (<Loading />)
}