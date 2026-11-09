import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from './img/x-octagon.svg';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const form = document.querySelector('.form');

function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    iconUrl: errorIcon,
    class: 'toast-error',
    timeout: 4000,
  });
}

async function onSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (!query) {
    showError('Please enter a search query!');
    return;
  }

  clearGallery();
  showLoader();
  form.reset();

  try {
    const data = await getImagesByQuery(query);

    if (data.hits.length === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    createGallery(data.hits);
  } catch {
    showError('Something went wrong. Please try again later.');
  } finally {
    hideLoader();
  }
}

form.addEventListener('submit', onSearch);
