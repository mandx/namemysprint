import React, { Component, PropTypes } from 'react';
import fetchWikiData from './wiki-data';


class ModelInfo extends Component {
  static propTypes = {
    model: PropTypes.shape({
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      years: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
  }

  componentDidMount() {
    this.fetch(this.props.model);
  }

  componentWillReceiveProps(nextProps) {
    this.fetch(nextProps.model);
  }

  fetch(model) {
    fetchWikiData(model.make, model.model).then((info) => {
      this.setState({ info, });
    });
  }

  render() {
    const { info } = this.state;

    return (
      info.extract ? <blockquote>{info.extract}</blockquote> : <span/>
    );
  }
}


export default ModelInfo;