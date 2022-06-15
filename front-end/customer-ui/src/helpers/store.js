import { createStore } from 'redux';
import { reducer } from '../redux/reducers/userReducer';

const store = createStore(reducer)

export default store;