import React, { useState } from 'react';
import logo from '../assets/logo.svg'
import './Login.css'
import api from '../services/api'

export default function Login({ history }) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await api.post('/devs', {
            username
        });

        const { _id } = response.data;

        history.push(`/dev/${_id}` )
    }
    return (
        // className em vez de class pq classname é
        // palavra reservada
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt='Tindev' />
                <input placeholder="Digite seu usuário do Github"
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <button type="submit">Enviar</button>
            </form>
        </div>

    );
}
// estado do componente é toda e qq info que o componente modifica