const changeState = require('../changeState');

describe('changeState', () => {
  let circle;

  beforeEach(() => {
    document.body.innerHTML = '<div id="circle"></div>';
    circle = document.getElementById('circle');
  });

  test("sets red when recording and gray when idle", () => {
    changeState('recording');
    expect(circle.style.backgroundColor).toBe('red');
    changeState('idle');
    expect(circle.style.backgroundColor).toBe('gray');
  });
});
