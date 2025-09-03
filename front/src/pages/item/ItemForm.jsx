import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ItemService from '../../services/ItemService';

const ItemForm = ({ leilaoId, onCriado, onCancel }) => {
    const [item, setItem] = useState({ nome:'', descricao:'', precoInicial: 0 });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const service = new ItemService();

    const salvar = async () => {
        
        // Validação dos campos
        if (!item.nome.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Nome é obrigatório' });
            return;
        }
        if (!item.descricao.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Descrição é obrigatória' });
            return;
        }
        if (item.precoInicial <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Preço inicial deve ser maior que zero' });
            return;
        }
        if (!leilaoId) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Leilão não selecionado' });
            return;
        }

        setLoading(true);
        try {
            const payload = { 
                ...item, 
                precoInicial: parseFloat(item.precoInicial),
                leilao: { id: leilaoId } 
            };
            const response = await service.criar(payload);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Item criado com sucesso' });
            onCriado?.();
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || 'Erro ao criar item';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="p-fluid">
                <div className="p-field">
                    <label>Nome</label>
                    <InputText value={item.nome} onChange={(e)=>setItem({...item, nome:e.target.value})} />
                </div>
                <div className="p-field">
                    <label>Descrição</label>
                    <InputTextarea value={item.descricao} onChange={(e)=>setItem({...item, descricao:e.target.value})} rows={4} />
                </div>
                <div className="p-field">
                    <label>Preço Inicial</label>
                    <InputText 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        value={item.precoInicial} 
                        onChange={(e) => setItem({...item, precoInicial: parseFloat(e.target.value) || 0})} 
                    />
                </div>
                <div className="p-d-flex p-jc-end">
                    <Button label="Cancelar" className="p-button-text" onClick={onCancel} disabled={loading} />
                    <Button 
                        label={loading ? "Salvando..." : "Salvar"} 
                        className="p-button-success" 
                        onClick={salvar} 
                        loading={loading}
                        style={{marginLeft:8}} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ItemForm;
