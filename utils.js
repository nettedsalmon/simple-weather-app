import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const signs = [
  'С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'
]

export function normalizeTemp(string) {
  const temp = Math.round(Number(string));

  return temp > 0 ? '+' + temp : temp;
}

export function convertPressure(string) {
  return Math.round(Number(string) * 0.75);
}

export function convertWindDirection(string) {
  const index = Math.round(Number(string) / 45) % 8;

  return signs[index];
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function normalizeDate(date) {
  return dayjs(date).format('HH:mm');
}

export function getPath(type, city, appId) {
  return `https://api.openweathermap.org/data/2.5/${type}?q=${city}&units=metric&lang=ru&appid=${appId}`
}