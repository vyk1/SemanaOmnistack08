import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { Link } from 'react-router-dom'

import './Main.css'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'

import itsamatch from '../assets/itsamatch.png'

import api from '../services/api'

// match são todos os params passados pelas rotas
export default function Main({ match }) {
    //toda vez q usar var q alterada, usar use state
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    // chama api
    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { user: match.params.id }
            })
            setUsers(response.data);
        }
        loadUsers();
    }, [match.params.id]);

    // conecta com websocket
    useEffect(() => {
        const socket = io('http://localhost:3000', {
            query: {
                user: match.params.id
            }
        });
        // OUVIR EVENTO DE MATCH
        socket.on('match', dev => {
            setMatchDev(dev);
        })
    }, [match.params.id]);

    // padrão de handle para ops com inputs de
    // usuários
    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id }
        });
        // sempre sobrescrever em vez de splicear
        setUsers(users.filter(user => user._id !== id));
    }
    async function handleDislike(id) {
        //endereço, body e header
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id }
        });
        // sempre sobrescrever em vez de splicear
        setUsers(users.filter(user => user._id !== id));
    }
    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt='Tindev' />
            </Link>
            {/* como o map está dentro de um return
                pode-se abstraí-lo utlizando apenas
            parenteses */}
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        // o erro de unique key
                        // obriga o React a renderizar tudo de novo
                        // pode-se solucionar este erro incluindo o atr key
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like" />
                                </button>
                                {/* handleDislike() -> disparada ao executada */}
                                {/* ()=> handleDislike() -> disparada apenas ao clicar*/}
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) :
                (
                    <div className="empty">Acabou ):</div>
                )
            }
            {
                matchDev && (
                    <div className='match-container'>
                        <img src={itsamatch} alt="it's a match" />
                        <img className="avatar" src={matchDev.avatar} alt="avatar" />
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>

                        <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
                    </div>
                )
            }

        </div>
    );
}
