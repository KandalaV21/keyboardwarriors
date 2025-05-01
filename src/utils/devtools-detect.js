// Detect if DevTools is open and throw an error if so
(function () {
  let threshold = 160;
  let devtoolsOpen = false;
  const emitError = () => {
    throw new Error('DevTools are not allowed!');
  };
  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
      devtoolsOpen = true;
      emitError();
    } else if (!(widthThreshold || heightThreshold)) {
      devtoolsOpen = false;
    }
  }
  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 1000);
})();
