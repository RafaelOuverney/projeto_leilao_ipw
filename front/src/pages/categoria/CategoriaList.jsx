import React, { useEffect, useState, useRef } from 'react';
import CategoriaService from '../../services/CategoriaService';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import CategoriaForm from './CategoriaForm';
import './Categoria.css';

const CategoriaList = () => {
    const service = new CategoriaService();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const toast = useRef(null);

    const [error, setError] = useState(null);

    const carregar = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const res = await service.listar({ page, size });
            const data = res.data.content || res.data || [];
            setCategorias(data);
        } catch (err) {
            console.error('Falha ao carregar categorias:', err);
            setError(err);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar categorias' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregar(); }, []);

    const [globalFilter, setGlobalFilter] = useState('');
    const dtRef = useRef(null);

    const abrirNovo = () => { setSelected(null); setVisible(true); };

    const editar = (row) => { setSelected(row); setVisible(true); };

    const remover = (row) => {
        confirmDialog({
            message: `Confirma exclusão da categoria "${row.nome}"?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await service.excluir(row.id);
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria removida' });
                    carregar();
                } catch (err) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover' });
                }
            }
        });
    };

    const onSaved = () => { setVisible(false); carregar(); };

    const leftContents = (
        <div className="toolbar-left">
            <h3>Categorias</h3>
            <Tag value={`${categorias.length}`} severity="info" style={{ marginLeft: 8 }} />
        </div>
    );

    const rightContents = (
        <div className="toolbar-right">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText placeholder="Pesquisar..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
            </span>
            <Button label="Novo" icon="pi pi-plus" className="p-button-success" onClick={abrirNovo} style={{ marginLeft: 8 }} />
        </div>
    );

    const actionBody = (row) => (
        <div className="actions-cell">
            <Button icon="pi pi-pencil" className="p-button-text" onClick={() => editar(row)} tooltip="Editar" />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => remover(row)} tooltip="Remover" />
        </div>
    );

    return (
        <div className="categoria-page">
            <Toast ref={toast} />
            <ConfirmDialog />
            <Toolbar left={leftContents} right={rightContents} />

            {error && (
                <div className="p-message p-message-error" style={{ margin: '0.75rem 0', padding: '0.75rem', borderRadius: 6 }}>
                    <strong>Erro ao carregar categorias.</strong>
                    <div style={{ marginTop: 6 }}>
                        <small>Verifique se o backend está rodando e se a URL da API ({process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}) está correta.</small>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <Button label="Tentar novamente" icon="pi pi-refresh" onClick={() => carregar()} />
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <DataTable ref={dtRef} value={categorias} loading={loading} emptyMessage="Nenhuma categoria" paginator rows={10}
                    globalFilter={globalFilter} responsiveLayout="scroll">
                    <Column field="id" header="ID" style={{ width: '6rem' }} />
                    <Column field="nome" header="Nome" />
                    <Column header="Ações" body={actionBody} style={{ width: '8rem' }} />
                </DataTable>
            </div>

            <Dialog header={selected ? 'Editar Categoria' : 'Nova Categoria'} visible={visible} style={{ width: '480px' }} onHide={() => setVisible(false)} breakpoints={{ '960px': '75vw', '640px': '95vw' }}>
                <CategoriaForm categoria={selected} onSaved={onSaved} onCancel={() => setVisible(false)} />
            </Dialog>
        </div>
    );
};

export default CategoriaList;
