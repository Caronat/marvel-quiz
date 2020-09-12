import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Signup = (props) => {

    const firebase = useContext(FirebaseContext);

    const data = {pseudo: '', email: '', password: '', confirmPassword: ''}

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('');

    const handleChange = e => {
        setLoginData({...loginData, [e.target.id]: e.target.value});
    }

    const validLoginData = () => {
        const {pseudo, email, password, confirmPassword} = loginData;
        return (pseudo !== '' && email !== '' && password !== '' && password === confirmPassword);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { email, password} = loginData;
        firebase.signupUser(email, password)
            .then(user => {
                setLoginData({...data});
                props.history.push('/welcome');
            })
            .catch(err => {
                setError(err);
                setLoginData({...data});
            })
    }

    // gestion erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">
                        {errorMsg}

                        <h2>Inscription</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={loginData.pseudo} type="text" id="pseudo" autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={loginData.email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={loginData.password} type="password" id="password" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={loginData.confirmPassword} type="password" id="confirmPassword" required />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>

                            {validLoginData() ? <button>Inscription</button> : <button disabled>Inscription</button>}
                        </form>

                        <div className="linkContainer">
                            <Link to="/login" className="simpleLink">Déjà inscrit ? Connectez-vous.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;