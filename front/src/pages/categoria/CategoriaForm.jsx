import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import CategoriaService from '../../services/CategoriaService';
import './Categoria.css';

const CategoriaForm = ({ categoria, onSaved, onCancel }) => {
    const service = new CategoriaService();
    const [nome, setNome] = useState(categoria?.nome || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useRef(null);

    useEffect(() => { setNome(categoria?.nome || ''); setErrors({}); }, [categoria]);

    const validate = () => {
        const e = {};
        if (!nome || nome.trim().length < 3) e.nome = 'Informe um nome com ao menos 3 caracteres.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const salvar = async () => {
        if (!validate()) {
            toast.current.show({ severity: 'warn', summary: 'Validação', detail: 'Corrija os erros antes de salvar.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = { id: categoria?.id, nome };
            if (categoria?.id) await service.alterar(payload.id ?? categoria.id, payload);
            else await service.criar(payload);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria salva' });
            onSaved();
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar' });
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="categoria-form">
            <Toast ref={toast} />
            <div className="p-fluid">
                <div className="p-field">
                    <label className={classNames({ 'p-error': errors.nome })}>Nome</label>
                    <InputText value={nome} onChange={(e) => setNome(e.target.value)} className={classNames({ 'p-invalid': errors.nome })} />
                    {errors.nome && <small className="p-error">{errors.nome}</small>}
                </div>
            </div>
            <div className="form-actions">
                <Button label="Cancelar" className="p-button-text" onClick={onCancel} />
                <Button label="Salvar" className="p-button-success" onClick={salvar} disabled={isSubmitting} />
            </div>
        </div>
    );
};

export default CategoriaForm;
