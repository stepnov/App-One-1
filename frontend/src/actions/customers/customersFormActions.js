import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { toast } from 'react-toastify';

const actions = {
  doNew: () => {
    return {
      type: 'CUSTOMERS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'CUSTOMERS_FORM_FIND_STARTED',
      });

      axios.get(`/customers/${id}`).then(res => {
        const record = res.data;

        dispatch({
          type: 'CUSTOMERS_FORM_FIND_SUCCESS',
          payload: record,
        });
      })
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CUSTOMERS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/customers'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'CUSTOMERS_FORM_CREATE_STARTED',
      });

      axios.post('/customers', { data: values }).then(res => {
        dispatch({
          type: 'CUSTOMERS_FORM_CREATE_SUCCESS',
        });

        toast.success('Customers created');
        dispatch(push('/admin/customers'));
      })
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CUSTOMERS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (
    dispatch,
    getState,
  ) => {
    try {
      dispatch({
        type: 'CUSTOMERS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/customers/${id}`, {id, data: values});

      dispatch(doInit());

      dispatch({
        type: 'CUSTOMERS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        toast.success('Profile updated');
      } else {
        toast.success('Customers updated');
        dispatch(push('/admin/customers'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CUSTOMERS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
