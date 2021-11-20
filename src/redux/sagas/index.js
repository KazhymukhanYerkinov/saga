import { all, call, spawn, take, fork, cancel } from 'redux-saga/effects';
import loadBasicData from './initialSagas';
import pageLoaderSaga from './pageLoaderSaga';

// take - вызывает только один раз
// takeEvery - вызывает каждый раз
// takeLast - вызывает только последную
// takeLeading -  вызывает только первую
// fork -  он не блокирует, функии работает паралельно
// spawn - если в функцей будет ошибка, он не блокирует. Дальше выполнять следущую функцую.
// join - он блокирует фунции, и ждет сага функцую
// select - с помощи этой функии, мы можем брать state из store-a


export function* fetchPlanets(signal) {
  console.log('LOAD_SOME_DATA starts');

  const response = yield call(fetch, 'https://swapi.dev/api/planets', {signal});
  const data = yield call([response, response.json]);

  console.log('LOAD_SOME_DATA completed', data);
}
export function* loadOnAction() {
  let task;
  let abortController = new AbortController();

  while(true) {
    yield take('LOAD_SOME_DATA');
    
    if (task) {
      abortController.abort();
      yield cancel(task);
      abortController = new AbortController();
    }
    task = yield fork(fetchPlanets, abortController.signal);
  }
}

export default function* rootSaga() {
  const sagas = [loadBasicData, pageLoaderSaga, loadOnAction];

  const retrySagas = yield sagas.map(saga => {
    return spawn(function* () {
      while(true) {
        try {
          yield call(saga);
          break;
        } catch (e) {
          console.log(e);
        }

      }
    })
  });
  yield all(retrySagas);
}