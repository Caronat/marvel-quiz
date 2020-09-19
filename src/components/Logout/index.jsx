import React, { useState, useEffect, useContext } from "react";
import ReactTooltip from 'react-tooltip';
import { FirebaseContext } from "../Firebase";

const Logout = (props) => {
  const firebase = useContext(FirebaseContext);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      firebase.logoutUser();
    }
  }, [checked, firebase]);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <div className="logoutContainer">
      <ReactTooltip place="left" effect="solid"/>

      <label className="switch">
        <input type="checkbox" checked={checked} onChange={handleChange} />
        <span className="slider round" data-tip="Déconnexion"></span>
      </label>
    </div>
  );
};

export default Logout;
