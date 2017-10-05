import React from 'react';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    const { lineid } = props.match.params;
    this.state = {
      lineId: lineid,
    };
  }

  render() {
    return (
      <h1>temp</h1>
    );
  }
}

export default Admin;
