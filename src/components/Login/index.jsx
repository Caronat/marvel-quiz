import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Login = (props) => {

    const firebase = useContext(FirebaseContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayBtn, setDisplayBtn] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setDisplayBtn(password.length > 5 && email !== '')
    }, [password, email]);

    const handleSubmit = e => {
        e.preventDefault();
        firebase.loginUser(email, password)
            .then(user => {
                setEmail('');
                setPassword('');
                props.history.push('/welcome');
            })
            .catch(error => {
                setError(error);
            });
    }

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftLogin">
                </div>

                <div className="formBoxRight">
                    <div className="formContent">

                        <h2>Connexion</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={e => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={e => setPassword(e.target.value)} value={password} type="password" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            {error !== '' && <span>{error.message}</span>}

                            {displayBtn && <button>Connexion</button>}
                        </form>

                        <div className="linkContainer">
                            <Link to="/signup" className="simpleLink">Nouveau sur Marvel Quiz ? Inscrivez-vous maintenant.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;