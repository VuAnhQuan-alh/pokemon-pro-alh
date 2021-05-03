import { UserAPI } from "../api/axiosClient";

const Rating = {
  async render() {
    const { data: users } = await UserAPI.list();

    const results = users
      .sort((a, b) => b.point - a.point)
      .filter((user, index) => index < 10)
      .map((user, ind) => {
      return `
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="w-6 h-6 py-0.5 text-center text-gray-600 text-sm font-medium rounded-full ${ind < 3 ? 'bg-green-300' : 'bg-blue-200'}">${ind + 1}</div>
            <div class="ml-3 text-gray-700 font-medium">${user.name}</div>
          </div>
          <div class="space-x-3">
            <span class="text-gray-600 font-bold">${user.point}</span>
            <span class="text-xl font-bold">${user.status ? '<i class="fas fa-long-arrow-alt-up text-green-300"></i>' : '<i class="fas fa-long-arrow-alt-down text-red-300"></i>'}</span>
          </div>
        </div>
      `;
    }).join("");
    return `
      <section class="my-4 py-3 px-4  w-full bg-white rounded-lg">
        <div class="flex justify-between items-end">
          <div class="w-28 h-4 rounded-full bg-blue-300"></div>
          <div class="text-green-400 text-5xl text-center">
            <i class="fas fa-chess-queen"></i>
          </div>
          <div class="w-28 h-4 rounded-full bg-blue-300"></div>
        </div>
        <div class="px-2 mt-4">${results}</div>
      </section>
    `;
  }
}

export default Rating;