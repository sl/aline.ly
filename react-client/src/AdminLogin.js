import React from 'react';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    const { lineid } = props.match.params;
    this.state = {
      lineId: lineid,
    };
  }

  render() {
    return (
      <h1>
        You are trying to login as an admin to: {this.state.lineId}
      </h1>
    );
  }
}

export default AdminLogin;
