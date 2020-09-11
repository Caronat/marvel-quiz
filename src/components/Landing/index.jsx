import React, { useRef, useEffect, useState } from 'react';
import Btn from './Btn';

const Landing = () => {

    const refWolverine = useRef(null);

    const [btn, setBtn] = useState(false);

    useEffect(() => {
        refWolverine.current.classList.add("startingImg");
        setTimeout(() => {
            refWolverine.current.classList.remove("startingImg")
            setBtn(true);
        }, 3000);
    }, []);

    return (
        <main ref={refWolverine} className="welcomePage">
            {btn && <Btn />}
        </main>
    )
}

export default Landing;