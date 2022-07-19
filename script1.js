//** --------------- View ----------------------
const View = (() => {
  const DOM = {
    container: '#root',
    movieWrapper: '.wrapper',
    leftBtn: '#leftBtn',
    rightBtn: '#rightBtn',
  };

  const render = (container, content, direction) => {
    if (!direction) {
      container.append(...content)
    } else if (direction === 'left') {
      container.innerHTML = content + container.innerHTML;
    } else if (direction === 'right') {
      container.innerHTML = container.innerHTML + content;
    }
  };

  const generateTemplate1 = (dataArr) => {
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

  const generateTemplate = (moviesList) => {
    return moviesList.reduce((prev, curr) => {
      const { imgUrl, name, outlineInfo } = curr;
      const wrapper = document.createElement('div');
      wrapper.className = 'wrapper';
      wrapper.innerHTML = `
          <img src="${imgUrl}" />
          <p> Movie: <span>${name}</span></p>
          <p> Info: <span>${outlineInfo}</span></p>
      `;
      return [...prev, wrapper];
    }, []);
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

  const getMovies = () => movies;
  const setMovies = (data) => {
    movies = [...data];
    View.render(
      document.querySelector(View.DOM.container),
      View.generateTemplate(movies)
    );
  };

  const pushMovies = (movies) => movies.push(movies);
  const shiftMovies = (movies) => movies.shift(movies);

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

  const leftBoundry = 0;
  const rightBoudry = () => {
    return (State.getMovies().length - 4) * -getWrapperSize();
  };

  const leftClick = () => {
    if (left >= leftBoundry) {
      const all = document.querySelectorAll('.wrapper');
      document.querySelector(View.DOM.container).prepend(View.generateTemplate(State.getMovies()));

      console.log(document.querySelector(View.DOM.container));
    }

    left = left + getWrapperSize();
    View.moveContainer(left);
    View.show(View.DOM.rightBtn);
  };

  const rightClick = () => {
    View.show(View.DOM.leftBtn);

    left = left - getWrapperSize();
    View.moveContainer(left);
    View.show(View.DOM.rightBtn);
  };

  return { leftClick, rightClick };
})();

//! ----
window.onload = () => {
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

leftBtn.onclick = Controls.leftClick;
rightBtn.onclick = Controls.rightClick;
