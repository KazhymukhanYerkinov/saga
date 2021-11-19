import { takeEvery, put, call, select } from 'redux-saga/effects';


// take - вызывает только один раз
// takeEvery - вызывает каждый раз
// takeLast - вызывает только последную
// takeLeading -  вызывает только первую
// fork -  он не блокирует, функии работает паралельно
// spawn - если в функцей будет ошибка, он не блокирует. Дальше выполнять следущую функцую.
// join - он блокирует фунции, и ждет сага функцую
// select - с помощи этой функии, мы можем брать state из store-a

async function swapiGet(pattern) {
  const request = await fetch(`http://swapi.dev/api/${pattern}`);

  const data = await request.json();

  return data;
}

export function* loadPeople() {
  const people = yield call(swapiGet, 'people');
  yield put({ type: 'SET_PEOPLE', payload: people.results });
  return people;
}
export function* loadPlanets() {
  const planets = yield call(swapiGet, 'planets');
  yield put({ type: 'SET_PLANETS', payload: planets.results });
}
export function* workerSaga() {
  yield call(loadPeople);
  yield call(loadPlanets);

  const store = yield select(s => s);
  console.log('finish parallel tasks', store);
}


export function* watchClickSaga() {
  yield takeEvery('LOAD_DATA', workerSaga);
}

export default function* rootSaga() {
  yield watchClickSaga();
}