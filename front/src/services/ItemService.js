import BaseService from './BaseService';

class ItemService extends BaseService {
    constructor(){ super('/item'); }

    async listar(params){
        return this.api.get(this.endPoint, { params });
    }

    async criar(data){
        return this.api.post(this.endPoint, data);
    }

    async excluir(id){
        return this.api.delete(`${this.endPoint}/${id}`);
    }
}

export default ItemService;
