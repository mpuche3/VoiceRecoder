function changeState(state) {
  const circle = document.getElementById('circle');
  if (!circle) return;
  switch (state) {
    case 'recording':
      circle.style.backgroundColor = 'red';
      break;
    case 'replaying':
      circle.style.backgroundColor = 'blue';
      break;
    default:
      circle.style.backgroundColor = 'gray';
  }
}

if (typeof module !== 'undefined') {
  module.exports = changeState;
}
