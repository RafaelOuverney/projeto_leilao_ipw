import React, {useRef, useState} from "react";
import './Login.css';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import AutenticacaoService from "../../services/AutenticacaoService";
import {useNavigate} from "react-router-dom";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";

const Login = () => {
    const autenticacaoService = new AutenticacaoService();
    const [usuario, setUsuario] = useState({email: '', senha: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleChange = (e) => {
        setUsuario({...usuario, [e.target.name]: e.target.value});
    };

    const login = async () => {
        setIsSubmitting(true);
        try {
            const resposta = await autenticacaoService.login(usuario);
            if (resposta?.status === 200 && resposta?.data?.token) {
                localStorage.setItem("usuario", JSON.stringify(resposta.data));
                toast.current?.show({ severity:'success', summary:'Sucesso', detail:'Login realizado', life:2000 });
                navigate("/");
            } else {
                const msg = resposta?.data?.mensagem || 'Erro ao fazer login';
                toast.current?.show({ severity:'error', summary:'Erro', detail: msg });
            }
        } catch (error) {
            const msg = error?.response?.data?.mensagem || error?.response?.data?.message || error?.message || 'Erro de conexão';
            toast.current?.show({ severity:'error', summary:'Erro', detail: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const showConfirmDialog = () => {
        confirmDialog({
            group: 'templating',
            header: 'Recuperar Senha',
            message: (
                <form onSubmit={login}>
                    <div className="field">
                        <label htmlFor="email">Email:</label>
                        <InputText
                            id="email"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                            style={{width: "100%"}}
                        />
                    </div>
                </form>
            ),
            acceptLabel: 'Enviar Email',
            rejectLabel: 'Cancelar',
            accept() {

                autenticacaoService.recuperarSenha(usuario.email)
                    .then(response => {
                        if (response.status === 200) {
                            alert("Email de recuperação enviado com sucesso!");
                        } else {
                            alert("Erro ao enviar email de recuperação");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Erro ao enviar email de recuperação");
                    });
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Email de recuperação enviado com sucesso!',
                    life: 3000,
                    color: 'green'
                });
            },
            reject() {
                toast.current.show({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'Ação cancelada pelo usuário',
                    life: 3000,
                    color: 'red'
                });
            }
        });
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
            >
                <div className="field">
                    <label htmlFor="email">Email:</label>
                    <InputText
                        id="email"
                        name="email"
                        value={usuario.email}
                        onChange={handleChange}
                        style={{width: "100%"}}
                    />
                </div>
                <div
                    className="field"
                    style={{
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    <label htmlFor="senha">Senha:</label>
                    <Password
                        id="senha"
                        name="senha"
                        value={usuario.senha}
                        onChange={handleChange}
                        inputStyle={{width: '100%'}}
                        toggleMask
                        feedback={false}
                    />
                    <Toast ref={toast}/>
                    <ConfirmDialog group="templating"/>
                    <span
                        style={{
                            cursor: 'pointer',
                            color: 'blue',
                            textDecoration: 'underline',
                            marginTop: '1rem',
                        }}
                        onClick={showConfirmDialog}
                    >
                        Esqueci minha senha
                    </span>
                </div>
                <Button label="Entrar" type="submit" disabled={isSubmitting}/>
                <Button
                    label="Registrar"
                    onClick={() => navigate('/registro')}
                    className="p-button-secondary"
                />
            </form>
        </div>
    );
};

export default Login;