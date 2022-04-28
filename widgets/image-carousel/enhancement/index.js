(function inititalize() {
  const slides = document.getElementsByClassName("carousel__item");
  const initialState = { idx: 0, size: slides.length };

  const store = createStore(initialState, reducer);

  const $nextBtn = document.getElementById("carousel__button--next");
  const $prevBtn = document.getElementById("carousel__button--prev");

  $nextBtn.addEventListener("click", () => {
    store.dispatch("NEXT");
  });

  $prevBtn.addEventListener("click", () => {
    store.dispatch("PREV");
  });

  function updateUI() {
    // to change which slide to be active
    let slidePosition = store.getState().idx;
    for (let slide of slides) {
      slide.classList.remove("carousel__item--visible");
      slide.classList.add("carousel__item--hidden");
    }
    slides[slidePosition].classList.add("carousel__item--visible");
  }

  function createStore(initialState, reducer) {
    const proxyState = new Proxy(
      { value: initialState },
      {
        set(obj, prop, value) {
          obj[prop] = value;
          console.log(`stateChange: ${prop}: ${value}`);
          updateUI();
        },
      }
    );

    function getState() {
      return { ...proxyState.value };
    }

    function dispatch(action) {
      let prevState = getState();
      proxyState.value = reducer(prevState, action);
    }

    return {
      getState,
      dispatch,
    };
  }

  function reducer(state, action) {
    switch (action) {
      case "NEXT":
        if (state.idx === state.size - 1) {
          state.idx = 0;
        } else {
          state.idx = state.idx + 1;
        }
        break;
      case "PREV":
        if (state.idx === 0) {
          state.idx = state.size - 1;
        } else {
          state.idx = state.idx + 1;
        }
        break;
      default:
        state = state;
        break;
    }
    return state;
  }
})();
