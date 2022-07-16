const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const root = document.getElementById('root');

//** --------------- View ----------------------
const View = (() => {
  const DOM = {
    container: '#root',
    movieWrapper: '.wrapper',
    leftBtn: '#leftBtn',
    rightBtn: '#rightBtn',
  };

  const render = (container, content) => {
    container.innerHTML = content;
  };

  const generateTemplate = (dataArr) => {
    return dataArr.reduce((prev, curr) => {
      const { imgUrl, name, outlineInfo } = curr;
      return (
        prev +
        `
        <div class="wrapper">
          <img src="${imgUrl}" />
          <p> Movie: <span>${name}</span></p>
          <p> Info: <span>${outlineInfo}</span></p>
        </div>
      `
      );
    }, '');
  };

  const moveContainer = (number) => {
    document.querySelector(DOM.container).style.left = number + 'px';
  };

  const show = (el) => {
    document.querySelector(el).style.display = 'block';
  };

  const hide = (el) => {
    document.querySelector(el).style.display = 'none';
  };

  return { render, generateTemplate, DOM, moveContainer, show, hide };
})();

//** --------------- State ----------------------
const State = (() => {
  let movies = [];

  const setMovies = (data) => {
    movies = [...data];
    View.render(
      document.querySelector(View.DOM.container),
      View.generateTemplate(movies)
    );
    Controls.init();
  };

  const pushMovies = (movies) => movies.push(movies);
  const shiftMovies = (movies) => movies.shift(movies);

  const getMovies = () => {
    return movies;
  };

  return { setMovies, getMovies, pushMovies, shiftMovies };
})();

//** -------------- Controls ---------------------
const Controls = (() => {
  let left = 0;

  const getWrapperSize = () => {
    const wrapper = document.querySelector(View.DOM.movieWrapper);
    if (wrapper) {
      return Number(wrapper.clientWidth);
    }
    return 200;
  };

  const leftBoundry = () => 0;
  const rightBoudry = () => {
    return (State.getMovies().length - 4) * -getWrapperSize();
  };

  const leftClick = () => {
    if (left === leftBoundry()) {
      View.hide(View.DOM.leftBtn);
    }
    View.show(View.DOM.rightBtn);

    if (left !== leftBoundry()) {
      left = left + getWrapperSize();
      View.moveContainer(left);
      View.show(View.DOM.leftBtn);
      return;
    }

    View.hide(View.DOM.leftBtn);
  };

  const rightClick = () => {
    View.show(View.DOM.leftBtn);

    if (left !== rightBoudry()) {
      left = left - getWrapperSize();
      View.moveContainer(left);
      View.show(View.DOM.rightBtn);
      return;
    }

    View.hide(View.DOM.rightBtn);
  };

  const init = () => {
    console.log(1);
  };

  return { leftClick, rightClick, init };
})();

//! ----
const init = () => {
  const baseUrl = 'http://localhost:4232/movies';
  fetch(baseUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network Error');
    })
    .then((jsonReponse) => {
      State.setMovies(jsonReponse);
    });
};

init();
leftBtn.onclick = Controls.leftClick;
rightBtn.onclick = Controls.rightClick;
