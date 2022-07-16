const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const root = document.getElementById('root');

const template = (moviesArr) => {
  let all = '';

  moviesArr.forEach((movie) => {
    const { imgUrl, name, outlineInfo } = movie;
    let template = `
      <div class="container">
          <img src="${imgUrl}" />
          <p> Movie: <span>${name}</span></p>
          <p> Info: <span>${outlineInfo}</span></p>
      </div>
    `;
    all += template;
  });

  root.innerHTML = all;
};

//! ~~~~~~~ Controls ~~~~~~~~~~~
const Controls = (() => {
  let currState = 0;
  let max = null;
  const containerSize = 200

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
    const edge = (max) * (-containerSize);
    if (currState === edge) {
      rightBtn.style.display = 'none';
    }
  };

  return { leftClick, rightClick, setMax };
})();

(() => {
  const baseUrl = 'http://localhost:4232/movies';
  fetch(baseUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network Error');
    })
    .then((jsonReponse) => {
      template(jsonReponse);
      Controls.setMax(jsonReponse.length);
    });
})();

leftBtn.style.display = 'none';
leftBtn.onclick = Controls.leftClick;
rightBtn.onclick = Controls.rightClick;
