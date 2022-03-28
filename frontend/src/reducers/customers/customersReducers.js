import list from 'reducers/customers/customersListReducers';
import form from 'reducers/customers/customersFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
