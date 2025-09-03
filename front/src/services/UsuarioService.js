import BaseService from './BaseService';

class UsuarioService extends BaseService {
    constructor(){ super('/pessoa'); }

    async atualizar(data){
        return this.api.put(this.endPoint, data);
    }

    async buscarPorId(id){
        return this.api.get(`${this.endPoint}/${id}`);
    }

    async buscarTodos(params){
        return this.api.get(this.endPoint, { params });
    }
}

export default UsuarioService;
