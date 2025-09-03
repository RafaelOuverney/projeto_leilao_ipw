import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Toolbar } from 'primereact/toolbar';
import PerfilService from "../../services/PerfilService";
import UsuarioService from "../../services/UsuarioService";
import './Perfil.css';


const Perfil = () => {
    const [perfis, setPerfis] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [perfil, setPerfil] = useState({ nome: "" });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const perfilService = new PerfilService();
    const usuarioService = new UsuarioService();
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        carregarPerfis();
        carregarUsuariosSeAdmin();
    }, []);

    const isAdmin = () => {
        try {
            const u = JSON.parse(localStorage.getItem('usuario')) || {};
            const pp = u.pessoaPerfil || [];
            return pp.some(p => p.perfil && (p.perfil.nome === 'ADMIN' || p.perfil.nome === 'ROLE_ADMIN'));
        } catch (e) { return false; }
    }

    const carregarUsuariosSeAdmin = async () => {
        if (!isAdmin()) return;
        try {
            const res = await usuarioService.buscarTodos({ page: 0, size: 50 });
            setUsuarios(res.data.content || []);
        } catch (err) {
            console.error('erro ao carregar usuarios', err);
        }
    }

    const carregarPerfis = async () => {
        setLoading(true);
        try {
            const data = await perfilService.buscarTodos();
            console.log(data);
            setPerfis(data.data.content);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar os perfis!",
            });
        } finally {
            setLoading(false);
        }
    };

    const abrirNovo = () => {
        setPerfil({ nome: "" });
        setDialogVisible(true);
        setIsEdit(false);
    };

    const esconderDialog = () => {
        setDialogVisible(false);
    };

    const salvarPerfil = async () => {
        try {
            if (isEdit) {
                await perfilService.alterar(perfil);
                toast.current.show({ severity: "success", summary: "Atualizado", detail: "Perfil atualizado com sucesso!" });
            } else {
                await perfilService.inserir(perfil);
                toast.current.show({ severity: "success", summary: "Criado", detail: "Perfil criado com sucesso!" });
            }
            carregarPerfis();
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao salvar perfil",
            });
        } finally {
            esconderDialog();
        }
    };

    const editarPerfil = (perfil) => {
        setPerfil({ ...perfil });
        setDialogVisible(true);
        setIsEdit(true);
    };

    const confirmarExclusaoPerfil = (perfil) => {
        confirmDialog({
            message: `Remover o perfil "${perfil.nome}"?`,
            header: "Confirmação",
            icon: "pi pi-exclamation-triangle",
            accept: () => excluirPerfil(perfil),
        });
    };

    const excluirPerfil = async (perfil) => {
        try {
            await perfilService.excluir(perfil.id);
            toast.current.show({ severity: "warn", summary: "Removido", detail: "Perfil removido com sucesso" });
            carregarPerfis();
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao remover o perfil",
            });
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editarPerfil(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => confirmarExclusaoPerfil(rowData)}
                />
            </>
        );
    };

    const dialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={esconderDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={salvarPerfil} />
        </div>
    );

    const leftToolbar = (
        <div className="p-d-flex p-ai-center">
            <h3>Perfis</h3>
        </div>
    );

    const rightToolbar = (
        <div>
            <Button label="Novo Perfil" icon="pi pi-plus" className="p-button-success" onClick={abrirNovo} />
        </div>
    );

    return (
        <div className="perfil-page p-grid p-justify-center">
            <Toast ref={toast} />
            <ConfirmDialog acceptLabel="Sim" rejectLabel="Não" />

            <div className="p-col-12 p-md-4">
                <Card className="profile-card">
                    <div className="profile-top">
                        <Avatar label={ (JSON.parse(localStorage.getItem('usuario'))?.nome || 'U').split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() } size="xlarge" shape="circle" />
                        <div className="profile-info">
                            <h2>{JSON.parse(localStorage.getItem('usuario'))?.nome || 'Usuário'}</h2>
                            <p className="muted">{JSON.parse(localStorage.getItem('usuario'))?.email || ''}</p>
                            <div className="profile-actions">
                                <Button label="Editar perfil" icon="pi pi-user-edit" className="p-button-text" onClick={() => { window.location.href = '/usuario/editar'; }} />
                            </div>
                        </div>
                    </div>
                    <div className="profile-body">
                        <p className="muted">Gerencie os perfis de acesso abaixo.</p>
                    </div>
                </Card>
            </div>

            <div className="p-col-12 p-md-8">
                <Toolbar left={leftToolbar} right={rightToolbar} className="mb-2" />

                <div className="card table-card">
                    <div className="table-header p-d-flex p-jc-between p-ai-center">
                        <div className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Pesquisar perfis..." value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} />
                        </div>
                    </div>

                    <DataTable
                        value={perfis}
                        loading={loading}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        className="p-mt-2"
                    >
                        <Column field="nome" header="Nome"></Column>
                        <Column body={actionBodyTemplate} header="Ações" style={{ width: '8rem' }}></Column>
                    </DataTable>
                    {isAdmin() && (
                        <div className="card table-card p-mt-4">
                            <h4>Usuários do sistema (admin)</h4>
                            <DataTable value={usuarios} paginator rows={10} className="p-mt-2">
                                <Column field="nome" header="Nome" />
                                <Column field="email" header="Email" />
                            </DataTable>
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                visible={dialogVisible}
                style={{ width: "420px" }}
                header={isEdit ? "Editar Perfil" : "Novo Perfil"}
                modal
                footer={dialogFooter}
                onHide={esconderDialog}
            >
                <div className="field">
                    <label htmlFor="nome">Nome: </label>
                    <InputText
                        id="nome"
                        value={perfil.nome}
                        onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                        required
                        className="w-full"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Perfil;