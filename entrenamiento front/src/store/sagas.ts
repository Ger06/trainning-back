import { all, fork } from 'redux-saga/effects';
import { watchCheckAuth, watchLogin, watchLogout } from './auth/saga';
import {
  watchCreateExercise,
  watchDeleteExercise,
  watchFetchExercises,
  watchSearchExercises,
  watchUpdateExercise,
} from './exerciseLibrary/saga';
import {
  watchCreateRoutine,
  watchDeleteRoutine,
  watchFetchStudentRoutines,
  watchFetchStudents,
  watchSearchStudents,
  watchUpdateRoutine,
} from './trainer/saga';

export default function* allSagas() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchCheckAuth),
    fork(watchFetchStudents),
    fork(watchSearchStudents),
    fork(watchCreateRoutine),
    fork(watchUpdateRoutine),
    fork(watchDeleteRoutine),
    fork(watchFetchStudentRoutines),
    fork(watchFetchExercises),
    fork(watchSearchExercises),
    fork(watchCreateExercise),
    fork(watchUpdateExercise),
    fork(watchDeleteExercise),
  ]);
}
