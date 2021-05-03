import Rating from './Rating';
import { UserAPI } from './../api/axiosClient';

export const Form = {
  render() {
    return `
      <section class="bg-white rounded-lg py-5">
        <div class="text-center text-2xl font-bold text-gray-700">Register / Login</div>
        <div class="flex flex-wrap justify-center mt-8">
          <div class="space-y-3">
            <div class="relative">
              <span class="absolute top-1.5 left-4 text-gray-400">
                <i class="fas fa-user text-lg"></i>
              </span>
              <input
                autocomplete="off"
                type="text"
                id="username"
                placeholder="Username"
                class="w-64 pl-10 pr-4 py-1 rounded-full focus:outline-none border border-transparent border-1 focus:border-gray-300 bg-gray-200 focus:bg-gray-100 text-gray-600"
              />
            </div>
            <div class="relative">
              <span class="absolute top-1.5 left-4 text-gray-400">
                <i class="fas fa-passport"></i>
              </span>
              <input
                type="password"
                id="password"
                placeholder="Password"
                class="w-64 pl-10 pr-4 py-1 rounded-full focus:outline-none border border-transparent border-1 focus:border-gray-300 bg-gray-200 focus:bg-gray-100 text-gray-600"
              />
            </div>
          </div>
          <button type="button" id="join-game" class="mt-5 w-64 py-1 rounded-full focus:outline-none bg-green-400 text-white font-medium">Play game</button>
        </div>
      </section>
    `;
  },
  async afterRender() {
    const { data: users } = await UserAPI.list();
    document.querySelector("#join-game").addEventListener("click",async function() {
      var _id = 0;
      var regis = true;
      const _user = {
        name: (document.querySelector("#username") as HTMLInputElement).value,
        password: (document.querySelector("#password") as HTMLInputElement).value,
        point: 0,
        status: true
      }

      users.forEach(user => {
        if (user.name === _user.name && user.password === _user.password) {
          regis = false;
          _id = user.id;
        }
      });
      if (regis) {
        await UserAPI.create(_user);
        const { data: users } = await UserAPI.list();
        _id = users.map(user => user.name).lastIndexOf(_user.name) + 1;
      }
      const { data: user } = await UserAPI.read(_id);
      const _player = {
        id: user.id,
        name: user.name,
        point: user.point
      }
      localStorage.setItem("player", JSON.stringify(_player));
      await Rating.render();
      window.location.href = 'http://localhost:1404/#/pokemon/play-game';
    });
  }
}

export const PlayForm = {
  render() {
    let user = localStorage.getItem('player');
    let player = user ? JSON.parse(user) : {}
    const { name, point, status } = player;
    return `
      <section class="bg-white rounded-lg py-5">
        <div class="mx-5 flex justify-between items-center">
          <div class="text-yellow-500 font-bold text-xl">${name}</div>
          <div class="text-gray-600 font-medium">
            Max:
            <span class="ml-2 px-3 py-2 rounded font-bold text-white bg-green-400">
              ${point}
            </span>
          </div>
        </div>
        <div class="mx-5 mt-4 flex justify-between items-center">
          <div class="text-xl font-medium text-gray-600">Level:</div>
          <div class="flex space-x-2 text-white text-xs">
            <button
              type="button"
              id="eas"
              class="w-14 h-6 flex justify-center items-center rounded bg-red-300 font-bold focus:outline-none"
            >Easy</button>
            <button
              type="button"
              id="nor"
              class="w-14 h-6 flex justify-center items-center rounded bg-blue-300 font-bold focus:outline-none"
            >Normal</button>
            <button
              type="button"
              id="dif"
              class="w-14 h-6 flex justify-center items-center rounded bg-blue-300 font-bold focus:outline-none"
            >Difficult</button>
          </div>
        </div>
        <div class="mx-5 mt-4">
          <div class="w-full h-6 text-center flex justify-end text-blue-400 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300">
            <div id="progress-done" class="w-0 bg-gray-300 text-center"></div>
          </div>
        </div>
        <div id="point" class="my-2 text-center text-3xl font-bold text-gray-600">0</div>
        <div class="mx-5 flex justify-between item-center text-gray-600 font-medium">
          <div id="start-game" class="w-20 h-8 py-1 text-center rounded bg-gray-300 cursor-pointer hover:bg-green-400">Start</div>
          <div id="new-game" class="w-20 h-8 py-1 text-center rounded bg-gray-300 cursor-pointer hover:bg-green-400">New</div>
          <div id="out-game" class="w-20 h-8 py-1 text-center rounded bg-gray-300 cursor-pointer hover:bg-green-400">Logout</div>
        </div>
      </section>
    `;
  },
  afterRender() {
    document.querySelectorAll('button').forEach(element => {
      element.addEventListener("click", function(event) {
        event.preventDefault();
        document.querySelectorAll('button').forEach(_element => {
          if (_element.classList.contains("bg-red-300")) {
            _element.classList.remove("bg-red-300");
            _element.classList.add("bg-blue-300");
          }
        });
        element.classList.add("bg-red-300");
        element.classList.remove("bg-blue-300");
      });
    });
  }
}