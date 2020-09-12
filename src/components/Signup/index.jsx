import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Signup = (props) => {

    const firebase = useContext(FirebaseContext);

    const data = {pseudo: '', email: '', password: '', confirmPassword: ''}

    const [signupData, setSignupData] = useState(data);
    const [error, setError] = useState('');

    const handleChange = e => {
        setSignupData({...signupData, [e.target.id]: e.target.value});
    }

    const validSignupData = () => {
        const {pseudo, email, password, confirmPassword} = signupData;
        return (pseudo !== '' && email !== '' && password !== '' && password === confirmPassword);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { email, password} = signupData;
        firebase.signupUser(email, password)
            .then(user => {
                setSignupData({...data});
                props.history.push('/welcome');
            })
            .catch(error => {
                setError(error);
                setSignupData({...data});
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

                        <h2>Inscription</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={signupData.pseudo} type="text" id="pseudo" autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={signupData.email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={signupData.password} type="password" id="password" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={signupData.confirmPassword} type="password" id="confirmPassword" required />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>

                            {errorMsg}
                            
                            {validSignupData() && <button>Inscription</button>}
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