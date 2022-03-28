import React, { useEffect } from 'react';
import CarsWidget from 'pages/CRUD/Cars/page/CarsWidget';
import actions from 'actions/cars/carsFormActions';
import { connect } from 'react-redux';

const CarsViewPage = (props) => {

  const { dispatch, match, loading, record } = props;

  useEffect(() => {
    dispatch(actions.doFind(match.params.id))
  }, [match]);

  return (
    <React.Fragment>
      <CarsWidget
      loading={loading}
      record={record}
      />
    </React.Fragment>
  );
}

function mapStateToProps(store) {
  return {
    loading: store.users.form.loading,
    record: store.users.form.record,
  };
}

export default connect(mapStateToProps)(CarsViewPage);
