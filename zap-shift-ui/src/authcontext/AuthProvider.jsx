import React from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const popupLogin = () => {
        return signInWithPopUp(auth, googleProvider);
    };

    const signInWithPopUp = () =>{
        return signInWithPopUp(auth, googleProvider);
    };

    const registerUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    };

    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () =>{
        return signOut(auth);
    };


    


    const authInfo = {
        registerUser,
        signInUser,
        signInWithPopUp,
        popupLogin,
        logOut
    };


    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;