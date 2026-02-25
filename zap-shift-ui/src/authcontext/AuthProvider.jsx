import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loader, setLoader] = useState(true);

    const popupLogin = () => {
        setLoader(true);
        return signInWithPopUp(auth, googleProvider);
    };

    const signInWithPopUp = () => {
        setLoader(true);
        return signInWithPopUp(auth, googleProvider);
    };

    const registerUser = (email, password) => {
        setLoader(true);
        return createUserWithEmailAndPassword(auth, email, password)
    };

    const signInUser = (email, password) => {
        setLoader(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoader(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoader(false);
        })

        return () => { 
            unsubscribe() 
        };
    })



    const authInfo = {
        registerUser,
        signInUser,
        signInWithPopUp,
        popupLogin,
        logOut,
        user,
        loader
    };


    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;