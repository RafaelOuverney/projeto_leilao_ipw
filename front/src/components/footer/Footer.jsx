import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="col about">
                    <h4>Leilão Online</h4>
                    <p>Plataforma de leilões com foco em segurança, transparência e facilidade de uso.</p>
                </div>

                <div className="col links">
                    <h4>Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/categoria">Categorias</a></li>
                        <li><a href="/item">Itens</a></li>
                        <li><a href="/perfil">Perfil</a></li>
                    </ul>
                </div>

                <div className="col contact">
                    <h4>Contato</h4>
                    <p>contato@leilao.example</p>
                    <div className="socials">
                        <a aria-label="facebook" href="#" className="pi pi-facebook" />
                        <a aria-label="twitter" href="#" className="pi pi-twitter" />
                        <a aria-label="instagram" href="#" className="pi pi-instagram" />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">&copy; {new Date().getFullYear()} Leilão Online — Todos os direitos reservados</div>
        </footer>
    );
};

export default Footer;