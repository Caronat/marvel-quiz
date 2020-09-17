import React, { useEffect, useState } from 'react';
import Stepper from 'react-stepper-horizontal';

const Levels = ({levelNames, quizLevel}) => {

    const [levels, setLevels] = useState([]);

    useEffect(() => {
        setLevels(levelNames.map(v=>({title: v.toUpperCase()})))
    }, [levelNames])

    return (
        <div className="levelsContainer" style={{background: 'transparent'}}>
            <Stepper
                steps={levels}
                activeStep={quizLevel}
                circleTop={0}
                activeTitleColor={'#d31017'}
                activeColor={'#d31017'}
                completeTitleColor={'#E0E0E0'}
                completeColor={'#E0E0E0'}
                defaultTitleColor={'#E0E0E0'}
            />
        </div>
    )
}

export default React.memo(Levels);