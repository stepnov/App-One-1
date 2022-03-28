import React, { useEffect } from 'react';
import CustomersWidget from 'pages/CRUD/Customers/page/CustomersWidget';
import actions from 'actions/customers/customersFormActions';
import { connect } from 'react-redux';

const CustomersViewPage = (props) => {

  const { dispatch, match, loading, record } = props;

  useEffect(() => {
    dispatch(actions.doFind(match.params.id))
  }, [match]);

  return (
    <React.Fragment>
      <CustomersWidget
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

export default connect(mapStateToProps)(CustomersViewPage);
