import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Calculadora from './pages/calculadora/Calculadora';
import Home from './pages/home/Home';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/tarefa/Cadastro';
import Login from './pages/login/Login';
import RotaPrivadaLayout from './components/layout/RotaPrivadaLayout';
import PadraoLayout from './components/layout/PadraoLayout';
import Perfil from './pages/perfil/Perfil';
import Registro from "./pages/registro/Registro";
import LeilaoCriar from './pages/leilao/LeilaoCriar';
import CategoriaList from './pages/categoria/CategoriaList';
import UsuarioEditar from './pages/usuario/UsuarioEditar';
import ItemList from './pages/item/ItemList';

function App() {
  return (
    <div className="App">
      {/*  <Header nome="Frank" /> */}
      <BrowserRouter>
        <Routes>
          <Route element={<RotaPrivadaLayout/>}>
            <Route path='/' element={<PadraoLayout>
              <Home/>
            </PadraoLayout>} />
            <Route path='/perfil' element={<PadraoLayout>
              <Perfil />
            </PadraoLayout>} />
            <Route path='/categoria' element={<PadraoLayout>
              <CategoriaList />
            </PadraoLayout>} />
            <Route path='/leilao/novo' element={<PadraoLayout>
              <LeilaoCriar />
            </PadraoLayout>} />
            <Route path='/usuario/editar' element={<PadraoLayout>
              <UsuarioEditar />
            </PadraoLayout>} />
            <Route path='/item' element={<PadraoLayout>
              <ItemList />
            </PadraoLayout>} />
          </Route>

          <Route path='/calculadora' element={<PadraoLayout>
            <Calculadora />
          </PadraoLayout>} />
          <Route path='/cadastro' element={<PadraoLayout>
            <Cadastro />
          </PadraoLayout>} />
          <Route path='/login' element={
            <Login />
          } />
          <Route path={'/registro'} element={
            <Registro />
          } />
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App;
