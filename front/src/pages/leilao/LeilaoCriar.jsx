import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LeilaoService from '../../services/LeilaoService';
import CategoriaService from '../../services/CategoriaService';
import { useNavigate } from 'react-router-dom';
import './LeilaoCriar.css';

const LeilaoCriar = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorInicial, setValorInicial] = useState(null);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [categoriaId, setCategoriaId] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({ nome: '', descricao: '', precoInicial: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const leilaoService = new LeilaoService();
  const categoriaService = new CategoriaService();

  useEffect(() => { carregarCategorias(); }, []);

  const carregarCategorias = async () => {
    try {
      const res = await categoriaService.listar();
      const raw = res.data.content || res.data || [];
      setCategorias(raw.map(c => ({ label: c.nome, value: c.id })));
    } catch (err) { console.error(err); }
  };

  const adicionarItem = () => {
    if (!novoItem.nome.trim() || !novoItem.descricao.trim() || novoItem.precoInicial <= 0) {
      toast.current.show({ severity: 'warn', summary: 'Validação', detail: 'Preencha todos os campos do item' });
      return;
    }
    setItens([...itens, { ...novoItem }]);
    setNovoItem({ nome: '', descricao: '', precoInicial: 0 });
  };

  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const salvar = async () => {
  if (!titulo || !valorInicial || !dataInicio || !dataFim) {
      toast.current.show({ severity: 'warn', summary: 'Validação', detail: 'Preencha todos os campos obrigatórios' });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
    titulo,
    descricao,
    valorInicial: typeof valorInicial === 'number' ? valorInicial : parseFloat(String(valorInicial).replace(',', '.')),
    dataInicio,
    dataFim,
    categoriaId,
    itens
      };
      await leilaoService.criar(payload);
      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Leilão criado' });
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar leilão' });
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="leilao-container">
      <Toast ref={toast} />
      <Card className="leilao-card">
        <div className="leilao-header">
          <h2>Novo Leilão</h2>
          <p className="muted">Preencha os dados abaixo para criar um novo leilão.</p>
        </div>

        <div className="leilao-grid">
          <div className="col">
            <label className="label">Título *</label>
            <InputText value={titulo} onChange={(e) => setTitulo(e.target.value)} />

            <label className="label">Descrição</label>
            <InputTextarea rows={6} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>

          <div className="col">
            <label className="label">Valor Inicial (R$) *</label>
            <InputNumber mode="currency" currency="BRL" locale="pt-BR" value={valorInicial} onValueChange={(e) => setValorInicial(e.value)} />

            <label className="label" style={{ marginTop: '1rem' }}>Categoria</label>
            <Dropdown options={categorias} value={categoriaId} onChange={(e) => setCategoriaId(e.value)} placeholder="Selecione" />

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="label">Data Início *</label>
                <Calendar showTime value={dataInicio} onChange={(e) => setDataInicio(e.value)} showButtonBar />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Data Fim *</label>
                <Calendar showTime value={dataFim} onChange={(e) => setDataFim(e.value)} showButtonBar />
              </div>
            </div>
          </div>
        </div>

        <div className="itens-section">
          <h3>Itens do Leilão</h3>
          <div className="novo-item-form">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
              <div>
                <label>Nome</label>
                <InputText value={novoItem.nome} onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })} />
              </div>
              <div>
                <label>Descrição</label>
                <InputText value={novoItem.descricao} onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })} />
              </div>
              <div>
                <label>Preço Inicial</label>
                <InputNumber value={novoItem.precoInicial} onValueChange={(e) => setNovoItem({ ...novoItem, precoInicial: e.value })} mode="currency" currency="BRL" locale="pt-BR" />
              </div>
              <Button label="Adicionar" icon="pi pi-plus" onClick={adicionarItem} />
            </div>
          </div>
          <DataTable value={itens} emptyMessage="Nenhum item adicionado">
            <Column field="nome" header="Nome" />
            <Column field="descricao" header="Descrição" />
            <Column field="precoInicial" header="Preço Inicial" body={(row) => `R$ ${row.precoInicial.toFixed(2)}`} />
            <Column body={(row, { rowIndex }) => <Button icon="pi pi-trash" className="p-button-danger" onClick={() => removerItem(rowIndex)} />} header="Ações" />
          </DataTable>
        </div>

        <div className="actions-row">
          <Button label="Salvar" className="p-button-success" onClick={salvar} loading={isSubmitting} />
          <Button label="Cancelar" className="p-button-secondary" onClick={() => navigate('/')} />
        </div>
      </Card>
    </div>
  );
};

export default LeilaoCriar;
