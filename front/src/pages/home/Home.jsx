import React from 'react';
import './Home.css';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import LeilaoService from '../../services/LeilaoService';
import CategoriaService from '../../services/CategoriaService';
import { useState, useEffect, useRef } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const [quickVisible, setQuickVisible] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorInicial, setValorInicial] = useState('');
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [categoriaId, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [leiloes, setLeiloes] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const leilaoService = new LeilaoService();
    const categoriaService = new CategoriaService();

    const isLogged = !!localStorage.getItem('usuario');

    useEffect(() => { 
        carregarCategorias(); 
        carregarLeiloes();
    }, []);

    const carregarCategorias = async () => {
        try {
            const res = await categoriaService.listar();
            setCategorias(res.data.content || res.data || []);
        } catch (err) { console.error(err); }
    };

    const carregarLeiloes = async () => {
        try {
            setLoading(true);
            const res = await leilaoService.listar({ page: 0, size: 10 });
            const leiloesData = res.data.content || res.data || [];
            setLeiloes(leiloesData);
        } catch (err) {
            console.error('Erro ao carregar leilões:', err);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar leilões' });
        } finally {
            setLoading(false);
        }
    };

    const salvarRapido = async () => {
        if (!titulo || !valorInicial || !dataInicio || !dataFim) {
            toast.current.show({ severity: 'warn', summary: 'Validação', detail: 'Preencha os campos obrigatórios' });
            return;
        }
        try {
            const payload = {
                titulo, descricao,
                valorInicial: parseFloat(valorInicial.toString().replace(',', '.')),
                dataInicio, dataFim,
                categoriaId: categoriaId || null
            };
            await leilaoService.criar(payload);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Leilão criado' });
            setQuickVisible(false);
            // reset
            setTitulo(''); setDescricao(''); setValorInicial(''); setDataInicio(null); setDataFim(null); setCategoriaId('');
            // reload leiloes
            carregarLeiloes();
        } catch (err) {
            console.error(err);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar leilão' });
        }
    };

    return (
        <div className="home-page">
            <Toast ref={toast} />
            <section className="hero">
                <div className="hero-content">
                    <h1>Participe do maior leilão online</h1>
                    <p>Descubra itens raros e dê lances com segurança. Cadastre-se e comece a ofertar hoje mesmo.</p>
                    <div className="hero-actions">
                        <Button label="Ver leilões" onClick={() => document.querySelector('.leiloes').scrollIntoView({ behavior: 'smooth' })} className="p-button-rounded p-button-lg" />
                        {!isLogged && <Button label="Registrar" onClick={() => navigate('/registro')} className="p-button-secondary p-button-rounded p-button-lg" />}
                        {isLogged && <Button label="Criar Leilão" onClick={() => navigate('/leilao/novo')} className="p-button-rounded p-button-lg" />}
                        {isLogged && <Button label="Criar Rápido" onClick={() => setQuickVisible(true)} className="p-button-secondary p-button-rounded p-button-lg" />}
                    </div>
                </div>
                <div className="hero-illustration" />
            </section>

            <section className="leiloes">
                <h2>Leilões em destaque</h2>
                {loading ? (
                    <div className="loading">Carregando leilões...</div>
                ) : (
                    <div className="cards">
                        {leiloes.length > 0 ? leiloes.map(item => (
                            <div className="card" key={item.id}>
                                <div className="card-media" />
                                <div className="card-body">
                                    <h3>{item.titulo}</h3>
                                    <p>{item.descricao}</p>
                                    <div className="card-footer">
                                        <div className="valor">R$ {item.valorInicial ? item.valorInicial.toFixed(2) : '0.00'}</div>
                                        <Button label="Ver Itens" onClick={() => navigate(`/item?leilao=${item.id}`)} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="no-leiloes">Nenhum leilão disponível no momento.</div>
                        )}
                    </div>
                )}
            </section>

            <section className="how-it-works">
                <h2>Como funciona</h2>
                <div className="steps">
                    <div className="step">Criar conta</div>
                    <div className="step">Encontrar itens</div>
                    <div className="step">Dar lance</div>
                    <div className="step">Receber notificação</div>
                </div>
            </section>

            <Dialog header="Criar Leilão Rápido" visible={quickVisible} style={{ width: '600px' }} onHide={() => setQuickVisible(false)}>
                <div className="field">
                    <label>Título</label>
                    <InputText value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div className="field">
                    <label>Descrição</label>
                    <InputTextarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div className="field" style={{ display: 'flex', gap: '1rem' }}>
                    <div>
                        <label>Valor Inicial</label>
                        <InputText value={valorInicial} onChange={(e) => setValorInicial(e.target.value)} />
                    </div>
                    <div>
                        <label>Categoria</label>
                        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                            <option value="">-- selecione --</option>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                </div>
                <div className="field" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <label>Data Início</label>
                        <Calendar showTime value={dataInicio} onChange={(e) => setDataInicio(e.value)} />
                    </div>
                    <div>
                        <label>Data Fim</label>
                        <Calendar showTime value={dataFim} onChange={(e) => setDataFim(e.value)} />
                    </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <Button label="Criar" onClick={salvarRapido} />
                    <Button label="Cancelar" className="p-button-secondary" onClick={() => setQuickVisible(false)} style={{ marginLeft: 8 }} />
                </div>
            </Dialog>
        </div>
    );
};

export default Home;
