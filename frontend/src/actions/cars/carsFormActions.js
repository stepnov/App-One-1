import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { toast } from 'react-toastify';

const actions = {
  doNew: () => {
    return {
      type: 'CARS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'CARS_FORM_FIND_STARTED',
      });

      axios.get(`/cars/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'CARS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CARS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/cars'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'CARS_FORM_CREATE_STARTED',
      });

      axios.post('/cars', { data: values }).then((res) => {
        dispatch({
          type: 'CARS_FORM_CREATE_SUCCESS',
        });

        toast.success('Cars created');
        dispatch(push('/admin/cars'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CARS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'CARS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/cars/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'CARS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        toast.success('Profile updated');
      } else {
        toast.success('Cars updated');
        dispatch(push('/admin/cars'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CARS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
