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
  let nodes = [];

  const getNodes = () => {
    return nodes;
  };

  const setNodes = (data) => {
    nodes = [...data];
    let i = -2;
    nodes.forEach((node) => {
      node.style.left = 200 * i + 'px';
      i += 1;
    });
  };

  const shiftToTail = () => {
    nodes.slice(0, 4).forEach((node) => {
      const currentEnd = nodes[nodes.length - 1];
      const pos = parseInt(currentEnd.style.left, 10);

      node.style.display = 'none';
      node.style.left = pos + 200 + 'px';
      setTimeout(() => (node.style.display = 'block'), 250);

      nodes.push(nodes.shift());
    });

    // const currEndPos = parseInt(nodes[nodes.length - 1].style.left, 10)
    // const currHead = nodes.shift()
    // currHead.style.display = 'none';
    // currHead.style.left = currEndPos + 200 + 'px'
    // //setTimeout(() => (nodes[0].style.display = 'block'), 250);
    // console.log(currHead)
    // nodes.push(currHead);
  };

  const shiftToHead = () => {
    nodes.slice(nodes.length - 2).forEach((node) => {
      const currentHead = nodes[0];
      const pos = parseInt(currentHead.style.left, 10);

      node.style.display = 'none';
      node.style.left = pos - 200 + 'px';
      setTimeout(() => (node.style.display = 'block'), 250);

      nodes.unshift(nodes.pop());
    });
  };

  return { getNodes, setNodes, shiftToTail, shiftToHead };
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
    const nodes = Model.getNodes();
    const currHead = parseInt(nodes[0].style.left, 10);

    nodes.forEach((node) => {
      const pos = parseInt(node.style.left, 10);
      node.style.left = pos + 200 + 'px';
    });

    if (currHead > -400) {
      Model.shiftToHead();
    }
  };

  const moveLeft = () => {
    const nodes = Model.getNodes();
    const currHead = parseInt(nodes[0].style.left, 10);

    if (currHead === -800) {
      Model.shiftToTail();
    }

    nodes.forEach((node) => {
      const pos = parseInt(node.style.left, 10);
      node.style.left = pos - 200 + 'px';
    });
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

// function getLeftPos() {
//   return parseInt(this.style.left, 10)
// }
