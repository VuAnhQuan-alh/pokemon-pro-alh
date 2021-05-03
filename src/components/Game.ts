import { PlayForm } from './Form';
import { PokemonAPI, UserAPI } from './../api/axiosClient';
import Rating from './Rating';
export const Game = {
  async render() {
    const promises = [];
    let _pokemon = [];

    for (let i = 0; i < 10 * 4; i ++) {
      if (i % 2 === 0) {
        promises.push(await PokemonAPI.read(i + 1));
      }
    }
    await Promise.all(promises).then(results => {
      const pokemon: {
        index: number,
        id: number,
        name: string,
        image: string
      }[] = [...results, ...results]
      .sort((): number => Math.random() - 0.5)
      .map((item, index) => ({
        index: index,
        id: item.data.id,
        name: item.data.name,
        image: item.data.sprites.front_shiny
      }));
      _pokemon = [...pokemon];
    });
    const result = _pokemon.map(poke => `
          <div class="w-28 h-28 bg-gray-200 m-1 bg-opacity-80 rounded-2xl">
            <div
              id="pokemon"
              data-id="${poke.id}"
              data-index="${poke.index}"
              class="rounded-2xl opacity-25 w-full h-full flex flex-col items-center cursor-pointer"
            >
              <img src="${poke.image}" alt="pokemon" />
              <span class="text-gray-600 font-medium -mt-3">${poke.name}</span>
            </div>
          </div>
        `).join("");

    return `
     <section class="h-full py-3 flex justify-center items-center flex-wrap">
      ${result}
     </section>
    `;
  },
  afterRender() {
    var checkPlay: boolean = true;
    var checkStart: boolean = true;
    var point = 0;
    var changePoint = false;
    var time: number = 25;

    // Start game
    (document.querySelector("#start-game") as HTMLDivElement).onclick = () => {
      if (!document.querySelector("#start-game").classList.contains("bg-green-400"))
        document.querySelector("#start-game").classList.add("bg-green-400");
      if (checkStart) {
        checkStart = false;

        document.querySelectorAll("button").forEach(btn => {
          if (btn.classList.contains("bg-red-300")) {
            if (btn.getAttribute("id") === "normal") {
              time = 20;
            } else if (btn.getAttribute("id") === "dif") {
              time = 15;
            }
          }
        });
        const pokeClick = document.querySelectorAll("#pokemon");
        let after: number, before: number, elements = [];
        Array.from(pokeClick).forEach(item => {
          item.addEventListener("click", function(): void {
            if (checkPlay) {
              item.classList.remove("opacity-25");
              item.classList.add("bg-yellow-200", "rounded-2xl");
              if (!after) {
                after = +item.getAttribute("data-id");
                elements.push(item);
              } else if (!before) {
                before = +item.getAttribute("data-id");
                elements.push(item);
                handleChange(after, before, elements);
                elements = [];
                after = undefined; before = undefined;
              }
            }
          });
        });
        interval_obj(time);
      }
    };


    // New game
    (document.querySelector("#new-game") as HTMLDivElement).onclick = async () => {
      checkStart = true;
      console.log("new")
      document.querySelector("#form-user").innerHTML = await PlayForm.render();
      await PlayForm.afterRender?.();
      document.querySelector("#rating").innerHTML = await Rating.render();
      // await Rating.afterRender?.();
      document.querySelector("#content").innerHTML = await Game.render();
      await Game.afterRender?.();
    };

    // Login
    (document.querySelector("#out-game") as HTMLDivElement).onclick = () => {
      checkStart = true;
      localStorage.removeItem('player');
      window.location.href = 'http://localhost:1404/#/pokemon';
    };


    function handleChange (before: number, after: number, elements): void {
      if (after === before && elements[0].getAttribute("data-index") !== elements[1].getAttribute("data-index")) {
        point += 8;
        changePoint = true;
        document.querySelector("#point").innerHTML = `${point}`;
        setTimeout(() => {
          elements.forEach(element => element.parentElement.classList.add("invisible"));
        }, 325);
      } else {
        changePoint = false;
        setTimeout(() => {
          elements.forEach(element => {
            element.classList.remove("bg-yellow-200", "rounded-2xl");
            element.classList.add("opacity-25");
          });
        }, 650);
      }
    };

    function interval_obj (time = 25) {
      var timeRun = 0;
      var element = document.querySelector("#progress-done") as HTMLDivElement;
      const interval = setInterval(async () => {
        if (changePoint) {
          timeRun > 2.5 ? timeRun -= 2.5 : timeRun = 0;
        }
        var value = +timeRun.toFixed(1);
        element.setAttribute("style", `width: ${value}%`);
        if (value === 100 || +point === 160) {
          checkPlay = false;
          await calculate(point + Math.floor(100 - timeRun));
          clearInterval(interval);
        }
        timeRun += 0.1;
        changePoint = false;
      }, time);
    };

    async function calculate (_point) {
      let user = localStorage.getItem('player');
      let player = user ? JSON.parse(user) : {}
      const { id, point } = player;
      if (point < _point) {
        let { data: _user } = await UserAPI.read(id);
        let _player = { ..._user, point: _point, status: true }
        await UserAPI.update(_player, id);
        _player = { ..._player, password: undefined, status: true }
        localStorage.setItem('player', JSON.stringify(_player));
      }
      document.querySelector("#rating").innerHTML = await Rating.render();
      // document.querySelector("#form-user").innerHTML = await PlayForm.render();
      await PlayForm.afterRender?.();
      await Game.afterRender?.();
    }
  }
}