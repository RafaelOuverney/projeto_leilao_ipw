import { Password } from "primereact/password";
import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import './Registro.css';

import { Divider } from "primereact/divider";
import { Toast } from 'primereact/toast';

const Registro = () => {
    const [valores, setValores] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const [senhasConferem, setSenhasConferem] = useState(true);
    const toast = useRef(null);

    const [criteriosSenha, setCriteriosSenha] = useState({
        tamanho: false,
        maiuscula: false,
        minuscula: false,
        numero: false,
        especial: false
    });

    useEffect(() => {
        if (valores.confirmarSenha) {
            setSenhasConferem(valores.senha === valores.confirmarSenha);
        } else {
            setSenhasConferem(true);
        }
    }, [valores.senha, valores.confirmarSenha]);

    useEffect(() => {
        const senha = valores.senha;
        setCriteriosSenha({
            tamanho: senha.length >= 6,
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            numero: /[0-9]/.test(senha),
            especial: /[^A-Za-z0-9]/.test(senha)
        });
    }, [valores.senha]); // Roda sempre que o campo 'senha' mudar

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!senhasConferem) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro de Validação',
                detail: 'As senhas não conferem. Por favor, verifique.'
            });
            return;
        }

        const todosCriteriosValidos = Object.values(criteriosSenha).every(criterio => criterio === true);

        if (!todosCriteriosValidos) {
            toast.current.show({
                severity: 'error',
                summary: 'Senha Fraca',
                detail: 'Sua senha não atende a todos os critérios de segurança.'
            });
            return;
        }

        console.log('Form Data:', valores);
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Registro enviado com sucesso!' });
    };

    const handleChange = (e) => {
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        });
    };
    const renderCriterio = (texto, valido) => {
        const cor = valores.senha.length > 0 ? (valido ? 'green' : 'red') : 'inherit';
        const icone = valores.senha.length > 0 ? (valido ? 'pi pi-check' : 'pi pi-times') : '';

        return (
            <li style={{ color: cor }}>
                <i className={icone} style={{ marginRight: '0.5rem' }}></i>
                {texto}
            </li>
        );
    };

    return (
        <div className="container">
            <Toast ref={toast} />
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <button name={"voltar"} style={{ position: 'absolute', color: 'white', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', top: '15px', left: '15px' }} onClick={(e) => { e.preventDefault(); window.history.back(); }}>                    <i className="pi pi-chevron-left" style={{ color: 'black' }} /></button>
                <button
                    type="button"
                    name={"voltar"}
                    style={{ position: 'absolute', color: 'white', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', top: '15px', left: '15px' }}
                    onClick={(e) => { e.preventDefault(); window.history.back(); }}
                    aria-label="Voltar"
                >

                </button>
                <div style={{ height: '20px' }}></div>
                <label htmlFor="nome">Nome:</label>
                <InputText value={valores.nome} name={'nome'} onChange={handleChange} placeholder={'Seu Nome'} />
                <label htmlFor="email">Email:</label>
                <InputText value={valores.email} onChange={handleChange} name="email" required placeholder={'Seu Email'} autoComplete="email"  />


                <label htmlFor="senha">Senha:</label>
                <Password
                    value={valores.senha}
                    name={'senha'}
                    onChange={handleChange}
                    inputStyle={{ width: '100%' }}
                    placeholder="Digite sua senha"
                    id="senha"
                    toggleMask
                    required
                    footer={(
                        <>
                            <Divider />
                            <p className="mt-2">Sua senha deve conter:</p>
                            <ul className="pl-2 ml-2 mt-0 line-height-3" style={{ listStyle: 'none', paddingLeft: 0 }}>
                                {renderCriterio('Pelo menos 6 caracteres', criteriosSenha.tamanho)}
                                {renderCriterio('Uma letra maiúscula', criteriosSenha.maiuscula)}
                                {renderCriterio('Uma letra minúscula', criteriosSenha.minuscula)}
                                {renderCriterio('Pelo menos um número', criteriosSenha.numero)}
                                {renderCriterio('Pelo menos um caractere especial', criteriosSenha.especial)}
                            </ul>
                        </>
                    )}
                />

                <label htmlFor={"confirmacao"}>Confirmar senha:</label>
                <Password
                    value={valores.confirmarSenha}
                    name={'confirmarSenha'}
                    onChange={handleChange}
                    inputStyle={{ width: '100%' }}
                    toggleMask
                    required
                    feedback={false}
                    placeholder="Confirme sua senha"
                    id="confirmacao"
                    autoComplete="new-password"
                    className={!senhasConferem ? 'p-invalid' : ''}
                />
                {!senhasConferem && <small className="p-error">As senhas não conferem.</small>}

                <div style={{ height: '20px' }}></div>

                <Button
                    type="submit"
                    label="Registrar"
                    style={{ width: '100%', height: '50px', fontSize: '16px', justifyContent: 'center' }}
                />
            </form>
        </div>
    );
}

export default Registro;