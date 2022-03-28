
import auth from 'reducers/auth';
import alerts from 'reducers/auth';
import navigation from 'reducers/navigation';
import layout from 'reducers/layout';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import customers from 'reducers/customers/customersReducers';

import users from 'reducers/users/usersReducers';

import cars from 'reducers/cars/carsReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    layout,
    alerts,
    auth,
    navigation,

    customers,

    users,

    cars,

  });

