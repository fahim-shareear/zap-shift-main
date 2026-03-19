import React, { useState } from 'react';

const useClickAnimation = () => {
    const [isClicked, setIsClicked] = useState(false);
    const handleMouseDown = () =>{
        setIsClicked(true);
    };
    const handleMouseUp = () =>{
        setTimeout(() => setIsClicked(false), 150);
    };


    return {
        isClicked,
        enevtHandlers :{
            onMouseDown: handleMouseDown,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
        },
    };
};

export default useClickAnimation;