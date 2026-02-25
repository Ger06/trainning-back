import { combineReducers } from 'redux';
import auth from './auth/reducer';
import exerciseLibrary from './exerciseLibrary/reducer';
import trainer from './trainer/reducer';

const reducers = combineReducers({
  auth,
  trainer,
  exerciseLibrary,
});

export default reducers;
