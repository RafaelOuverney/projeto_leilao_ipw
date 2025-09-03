import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useSearchParams } from 'react-router-dom';
import LeilaoService from '../../services/LeilaoService';
import ItemService from '../../services/ItemService';
import ItemForm from './ItemForm';

const ItemList = () => {
    const [leiloes, setLeiloes] = useState([]);
    const [selectedLeilao, setSelectedLeilao] = useState(null);
    const [items, setItems] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [searchParams] = useSearchParams();
    const toast = useRef(null);
    const leilaoService = new LeilaoService();
    const itemService = new ItemService();

    useEffect(()=>{ 
        loadLeiloes(); 
    }, []);

    useEffect(() => {
        const leilaoId = searchParams.get('leilao');
        if (leilaoId && leiloes.length > 0) {
            const leilao = leiloes.find(l => l.id == leilaoId);
            if (leilao) {
                setSelectedLeilao(leilao.id);
                carregarItems(leilao.id);
            }
        }
    }, [leiloes, searchParams]);

    const loadLeiloes = async () => {
        try{
            const res = await leilaoService.listar({ page:0, size:50 });
            const content = res.data.content || [];
            setLeiloes(content);
            const leilaoId = searchParams.get('leilao');
            if (leilaoId) {
                const leilao = content.find(l => l.id == leilaoId);
                if (leilao) {
                    setSelectedLeilao(leilao.id);
                }
            }
        }catch(e){ 
            console.error('Erro ao carregar leilões:', e); 
            setLeiloes([]); 
        }
    };

    const carregarItems = async (leilaoId) => {
        if (!leilaoId) return setItems([]);
        try{
            const res = await itemService.listar({ leilaoId });
            const data = res.data;
            const itemsList = Array.isArray(data) ? data : (data.content || []);
            setItems(itemsList);
        }catch(err){ 
            console.error('Erro ao carregar itens:', err); 
            toast.current.show({severity:'error', summary:'Erro', detail:'Falha ao carregar itens'}); 
            setItems([]);
        }
    };

    useEffect(() => {
        if (selectedLeilao) {
            carregarItems(selectedLeilao);
        } else {
            setItems([]);
        }
    }, [selectedLeilao]);

    const onLeilaoChange = (e) => { 
        setSelectedLeilao(e.value); 
    };

    const abrirNovo = () => {
        if (!selectedLeilao) { 
            toast.current.show({ severity:'warn', summary:'Atenção', detail:'Selecione um leilão primeiro' });
            return;
        }
        setDialogVisible(true);
    };

    const onCriado = () => { 
        setDialogVisible(false); 
        if (selectedLeilao) {
            carregarItems(selectedLeilao); 
        }
        toast.current.show({ severity:'success', summary:'Criado', detail:'Item criado com sucesso' }); 
    };

    const excluir = async (id) => {
        try{ 
            await itemService.excluir(id); 
            toast.current.show({severity:'success', summary:'Removido', detail:'Item removido com sucesso'});
            if (selectedLeilao) {
                carregarItems(selectedLeilao); 
            }
        }catch(e){ 
            console.error('Erro ao excluir item:', e);
            toast.current.show({severity:'error', summary:'Erro', detail:'Falha ao remover item'}); 
        }
    };

    const actionBody = (row) => (
        <Button icon="pi pi-trash" className="p-button-danger" onClick={()=>excluir(row.id)} />
    );

    return (
        <div>
            <Toast ref={toast} />
            <div style={{marginBottom:12}}>
                <Dropdown optionLabel="titulo" optionValue="id" value={selectedLeilao} options={leiloes} onChange={onLeilaoChange} placeholder="Selecione leilão" />
                <Button label="Novo Item" icon="pi pi-plus" className="p-button-success" onClick={abrirNovo} style={{marginLeft:12}} />
            </div>
            <DataTable value={items} paginator rows={10} emptyMessage="Nenhum item">
                <Column field="nome" header="Nome" />
                <Column field="descricao" header="Descrição" />
                <Column field="precoInicial" header="Preço Inicial" />
                <Column body={actionBody} header="Ações" style={{width: '6rem'}} />
            </DataTable>

            <Dialog visible={dialogVisible} header="Novo Item" modal onHide={()=>setDialogVisible(false)} style={{width:600}}>
                <ItemForm leilaoId={selectedLeilao} onCriado={onCriado} onCancel={()=>setDialogVisible(false)} />
            </Dialog>
        </div>
    );
};

export default ItemList;
