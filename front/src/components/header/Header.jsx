import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ nome }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [nomeUser, setNomeUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('usuario'))?.nome || nome || 'Usuário';
        } catch (e) { return nome || 'Usuário'; }
    });

    const isLogged = !!localStorage.getItem('usuario');

    const avatarUrl = (() => {
        try {
            return JSON.parse(localStorage.getItem('usuario'))?.avatarUrl || null;
        } catch (e) { return null; }
    })();

    const initials = (() => {
        try {
            const n = JSON.parse(localStorage.getItem('usuario'))?.nome || nomeUser || 'U';
            return n.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();
        } catch (e) { return 'U'; }
    })();

    useEffect(() => {
        const onStorage = (ev) => {
            if (ev.key === 'usuario') {
                try {
                    setNomeUser(JSON.parse(ev.newValue)?.nome || nome || 'Usuário');
                } catch (e) {
                    setNomeUser(nome || 'Usuário');
                }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [nome]);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        setNomeUser('Usuário');
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-inner">
                <div className="brand" onClick={() => navigate('/')} role="button">
                    <div className="logo" />
                    <span className="title">Leilão Online</span>
                </div>

                <nav className="nav">
                    <Link to="/">Home</Link>
                        <Link to="/categoria">Categorias</Link>
                    {isLogged && <a role="button" className={`nav-link ${location.pathname === '/item' ? 'active' : ''}`} onClick={() => navigate('/item')}>Itens</a>}
                    <Link to="/calculadora">Calculadora</Link>
                </nav>

                <div className="actions">
                    {!isLogged ? (
                        <Link className="btn-login" to="/login">Entrar</Link>
                    ) : (
                        <>
                            <div className="user">{nomeUser}</div>
                            <div className="avatar" role="button" title="Perfil" onClick={() => navigate('/perfil')}
                                style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined }}>
                                {!avatarUrl && <span className="avatar-initials">{initials}</span>}
                            </div>
                            <button className="btn-logout" onClick={handleLogout}>Sair</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;