//* ----------  API  ----------
const API = (() => {
  const baseUrl = 'http://localhost:4232/movies';
  const getData = async () => {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) {
        return await res.json();
      }
      throw new Error('Network Error');
    } catch (e) {
      console.log(e);
    }
  };

  return { getData };
})();

//* ---------- Model ----------
const Model = (() => {
  const nodes = [];
  const boundary = {};

  const getNodes = () => {
    return nodes;
  };

  const setNodes = (data) => {
    nodes.push(...data);
    const mid = Math.floor(nodes.length / 2);

    boundary.left = -200 * (mid - 1);
    boundary.right = 200 * (mid + 1);

    let x = boundary.left;
    nodes.forEach((node) => {
      node.style.left = x + 'px';
      x += 200;
    });
  };

  return { getNodes, setNodes, boundary };
})();

//* ---------  View  ------------
const View = (() => {
  const DOM = {
    root: '#root',
    container: '.container',
    btnLeft: '#btn_left',
    btnRight: '#btn_right',
  };

  const generateNodes = (movieArr) => {
    return movieArr.reduce((prev, curr) => {
      const wp = document.createElement('div');
      wp.className = 'container';
      const { imgUrl, name, outlineInfo } = curr;
      wp.innerHTML = `
          <img src="${imgUrl}" />
          <p> Movie: <span>${name}</span></p>
          <p> Info: <span>${outlineInfo}</span></p>
      `;
      return [...prev, wp];
    }, []);
  };

  const render = (container, nodes) => {
    document.querySelector(container).append(...nodes);
  };

  return { DOM, generateNodes, render };
})();

//* --------- Controller -------------
const Controller = (() => {
  const moveRight = () => {
    Model.getNodes().forEach((node) => {
      const pos = parseInt(node.style.left, 10);

      pos === Model.boundary.right
        ? shift(node, Model.boundary.left)
        : move(node, pos + 200);
    });
  };

  const moveLeft = () => {
    Model.getNodes().forEach((node) => {
      pos = parseInt(node.style.left, 10);

      pos === Model.boundary.left
        ? shift(node, Model.boundary.right)
        : move(node, pos - 200);
    });
  };

  const shift = (element, position) => {
    document.querySelector(View.DOM.root).removeChild(element);
    element.style.left = position + 'px';
    document.querySelector(View.DOM.root).append(element);
  };

  const move = (element, position) => {
    element.style.left = position + 'px';
  };

  const init = async () => {
    const data = await API.getData();
    const nodes = View.generateNodes(data);

    Model.setNodes(nodes);
    View.render(View.DOM.root, nodes);

    [View.DOM.btnLeft, View.DOM.btnRight].forEach((selector, _, self) => {
      const element = document.querySelector(selector);
      element.onclick = ({ currentTarget }) => {
        currentTarget.id === self[0].slice(1) ? moveRight() : moveLeft();
      };
    });
  };

  return { init };
})();

window.onload = Controller.init;
