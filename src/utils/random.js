function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}


export {getRandomArrayElement, getRandomInteger };
