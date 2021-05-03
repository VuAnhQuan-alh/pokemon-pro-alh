import { PokemonAPI } from "../api/axiosClient";

export const Prepare = {
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
          <div class="w-28 h-28 bg-gray-400 m-1 bg-opacity-80 rounded-2xl">
            <div id="pokemon-per" data-id="${poke.id}" class="rounded-2xl opacity-25 w-full h-full flex flex-col items-center">
              <img src="${poke.image}" alt="pokemon" />
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
    setInterval(function() {
      let rand = Math.floor(Math.random() * 40);
      document.querySelectorAll("#pokemon-per").forEach(item => {
        item.classList.remove("bg-yellow-200", "opacity-100");
        if (+item.getAttribute("data-id") === rand) {
          item.classList.add("bg-yellow-200", "opacity-100");
        }
      });
    }, 1050);
  }
}

export const Endgame = {
  render(name, point) {
    return `
      <section>
        <div>
          <div>
            <span>${name}}</span>
            <span>${point}</span>
          </div>
          <div>
            <div>New Game</div>
            <div>Logout</div>
          </div>
        </div>
      </section>
    `;
  }
}