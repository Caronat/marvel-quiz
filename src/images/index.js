import React, { useRef, useEffect, useState } from 'react';

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

    const displayBtn = btn && (
        <>
            <div className="leftBox">
                <button className="btn-welcome">Inscription</button>
            </div>
            <div className="rightBox">
                <button className="btn-welcome">Connexion</button>
            </div>
            div
            <div></div>
        </>
    )

    return (
        <main ref={refWolverine} className="welcomePage">
            {displayBtn}
        </main>
    )
}

export default Landing;