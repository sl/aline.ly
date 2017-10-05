import React from 'react';

class InLine extends React.Component {
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
        You are waiting in the line with ID: {this.state.lineId}
      </h1>
    );
  }
}

export default InLine;
