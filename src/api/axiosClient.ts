import axios from 'axios';

const axiosPokemon = axios.create({
  baseURL: "https://pokeapi.co/api/v2/pokemon",
  headers: {
    'Content-Type': 'application/json',
  }
});

const axiosUser = axios.create({
  baseURL: "http://localhost:5036",
  headers: {
    'Content-Type': 'application/json',
  }
});

export const PokemonAPI = {
  read(id) {
    const url = `/${id}`;
    return axiosPokemon.get(url);
  }
};

export const UserAPI = {
  list() {
    const url = `/users`;
    return axiosUser.get(url);
  },
  read(id) {
    const url = `/users/${id}`;
    return axiosUser.get(url);
  },
  create(data) {
    const url = `/users`;
    return axiosUser.post(url, data);
  },
  update(data, id) {
    const url = `/users/${id}`;
    return axiosUser.put(url, data);
  }
}