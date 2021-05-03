import { Prepare } from './components/Message';
import { Form, PlayForm } from './components/Form';
import { Game } from './components/Game';
import Rating from './components/Rating';

const parseRequestUrl = () => {
  const url = window.location.hash.toLowerCase();
  const request = url.split('/');
  return {
    source: request[1],
    path: request[2]
  }
}

const routes = {
  '/prepare': Prepare,
  '/play-game': Game,
}
const routeForm = {
  '/prepare': Form,
  '/play-game': PlayForm
}

const router = async () => {
  const { source, path } = parseRequestUrl();
  const patURL = path ? `/${path}` : '/prepare';
  const form = routeForm[patURL] ? routeForm[patURL] : '';
  const page = routes[patURL] ? routes[patURL] : '';

  document.querySelector("#form-user").innerHTML = await form.render();
  await form.afterRender?.();
  document.querySelector("#rating").innerHTML = await Rating.render();
  // await Rating.afterRender?.();
  document.querySelector("#content").innerHTML = await page.render();
  await page.afterRender?.();
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);