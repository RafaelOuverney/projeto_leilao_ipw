import BaseService from './BaseService';

class CategoriaService extends BaseService {
	constructor() {
		super('/categoria');
	}

	async listar(params) {
		return this.api.get(this.endPoint, { params });
	}

	async buscar(id) {
		return this.api.get(`${this.endPoint}/${id}`);
	}

	async criar(data) {
		return this.api.post(this.endPoint, data);
	}

	async alterar(data) {
		return this.api.put(this.endPoint, data);
	}

	async excluir(id) {
		return this.api.delete(`${this.endPoint}/${id}`);
	}
}

export default CategoriaService;
