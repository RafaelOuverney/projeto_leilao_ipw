import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import UsuarioService from '../../services/UsuarioService';
import './UsuarioEditar.css';

const UsuarioEditar = () => {
    const [usuario, setUsuario] = useState({ id: null, nome: '', email: '', avatarUrl: '' });
    const [saving, setSaving] = useState(false);
    const toast = useRef(null);
    const service = new UsuarioService();
    const perfilService = new (require('../../services/PerfilService').default)();
    const [perfis, setPerfis] = useState([]);
    const [selectedPerfil, setSelectedPerfil] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem('usuario')) || {};
            setUsuario({ id: u.id || null, nome: u.nome || '', email: u.email || '', avatarUrl: u.avatarUrl || '' });
            if (u.pessoaPerfil && Array.isArray(u.pessoaPerfil) && u.pessoaPerfil.length > 0) {
                const p = u.pessoaPerfil[0]?.perfil;
                if (p && p.id) {
                    setSelectedPerfil(p.id);
                    setUsuario(prev => ({ ...prev, pessoaPerfil: [{ perfil: { id: p.id } }] }));
                }
            }
        } catch (e) {}

        // load perfis
        perfilService.api.get(perfilService.endPoint)
            .then(res => {
                const data = res.data;
                if (Array.isArray(data)) setPerfis(data);
                else if (data && Array.isArray(data.content)) setPerfis(data.content);
                else setPerfis([]);
            })
            .catch(() => setPerfis([]));
    }, []);

    const salvar = async () => {
        setSaving(true);
        try {
            if (!usuario.id) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'ID do usuário ausente. Faça login novamente.' });
                setSaving(false);
                return;
            }
            const payload = { ...usuario };
            if (selectedPerfil) {
                payload.pessoaPerfil = [{ perfil: { id: selectedPerfil } }];
            }
            const res = await service.atualizar(payload);
            const existing = JSON.parse(localStorage.getItem('usuario')) || {};
            const merged = { ...existing, ...res.data };
            localStorage.setItem('usuario', JSON.stringify(merged));
            toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Usuário atualizado' });
            navigate(-1);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar usuário' });
        } finally { setSaving(false); }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setUsuario({ ...usuario, avatarUrl: reader.result });
        reader.readAsDataURL(file);
    };

    return (
        <div className="usuario-editar">
            <Toast ref={toast} />
            <div className="card">
                <h2>Editar Usuário</h2>
                <div className="field">
                    <label>Nome</label>
                    <InputText value={usuario.nome} onChange={(e)=>setUsuario({...usuario, nome:e.target.value})} />
                </div>
                <div className="field">
                    <label>Email</label>
                    <InputText value={usuario.email} onChange={(e)=>setUsuario({...usuario, email:e.target.value})} />
                </div>
                <div className="field">
                    <label>Avatar</label>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                    {usuario.avatarUrl && <img src={usuario.avatarUrl} alt="avatar" className="avatar-preview" />}
                </div>
                <div className="field">
                    <label>Perfil</label>
                    <Dropdown value={selectedPerfil} options={perfis} onChange={(e)=>{ setSelectedPerfil(e.value); setUsuario(prev => ({ ...prev, pessoaPerfil: e.value ? [{ perfil: { id: e.value } }] : [] })); }} optionLabel="nome" optionValue="id" placeholder="Selecione um perfil" />
                </div>
                <div className="actions">
                    <Button label="Salvar" icon="pi pi-check" onClick={salvar} loading={saving} />
                </div>
            </div>
        </div>
    );
};

export default UsuarioEditar;
