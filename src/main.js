import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from './img/x-octagon.svg';
import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalPages = 0;

function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    iconUrl: errorIcon,
    class: 'toast-error',
    timeout: 4000,
  });
}

function showInfo(message) {
  iziToast.info({
    message,
    position: 'topRight',
    class: 'toast-info',
    timeout: 4000,
  });
}

function showEndOfResults() {
  showInfo("We're sorry, but you've reached the end of search results.");
}

function scrollToNewImages() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function onSearch(event) {
  event.preventDefault();

  const value = event.currentTarget.elements['search-text'].value.trim();

  if (!value) {
    showError('Please enter a search query!');
    return;
  }

  query = value;
  page = 1;
  totalPages = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();
  form.reset();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    createGallery(data.hits);
    totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      showEndOfResults();
    }
  } catch {
    showError('Something went wrong. Please try again later.');
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    createGallery(data.hits);
    scrollToNewImages();

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      showEndOfResults();
    }
  } catch {
    page -= 1;
    showLoadMoreButton();
    showError('Something went wrong. Please try again later.');
  } finally {
    hideLoader();
  }
}

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
