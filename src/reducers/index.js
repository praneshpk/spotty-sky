import { combineReducers } from 'redux';
import auth from './auth';
import weather from './weather';

export default combineReducers({ auth, weather });
