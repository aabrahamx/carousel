const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const root = document.getElementById('root');

//** --------------- View ----------------------
const View = (() => {
  const DOM = {
    container: '#root',
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
        <div class="container">
          <img src="${imgUrl}" />
          <p> Movie: <span>${name}</span></p>
          <p> Info: <span>${outlineInfo}</span></p>
        </div>
      `
      );
    }, '');
  };

  return { render, generateTemplate, DOM };
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
  };

  const getMovies = () => {
    return movies
  };

  return { setMovies, getMovies };
})();


//** -------------- Controls ---------------------
const Controls = (() => {
  let currState = 0;
  let max = null;
  const containerSize = 200;

  const setMax = (length) => (max = length - 4);

  const leftClick = () => {
    currState = currState + containerSize;
    root.style.left = currState + 'px';
    rightBtn.style.display = 'block';
    if (currState === 0) {
      leftBtn.style.display = 'none';
    }
  };

  const rightClick = () => {
    currState = currState - containerSize;
    root.style.left = currState + 'px';
    leftBtn.style.display = 'block';
    const edge = max * -containerSize;
    if (currState === edge) {
      rightBtn.style.display = 'none';
    }
  };

  return { leftClick, rightClick, setMax };
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
      Controls.setMax(jsonReponse.length);
    });
};

init();
leftBtn.onclick = Controls.leftClick;
rightBtn.onclick = Controls.rightClick;
