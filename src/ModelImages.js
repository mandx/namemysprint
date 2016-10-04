import React, { Component, PropTypes } from 'react';
import _map from 'lodash/map';
import _bindAll from 'lodash/bindAll';
import classnames from 'classnames';
import { Thumbnail } from 'react-bootstrap';

import searchGoogleImages from './google-images';


class ModelImages extends Component {
  static propTypes = {
    offsetY: PropTypes.number,
    query: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentQuery: props.query,
      results: [],
      error: false,
      loading: false,
    };
    _bindAll(this, 'fetch');
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentQuery: nextProps.query, }, this.fetch);
  }

  fetch() {
    const { currentQuery } = this.state;

    if (currentQuery) {
      this.setState({ loading: true, error: false, results: [], });
      searchGoogleImages(currentQuery).then((results) => {
        this.setState({
          loading: false,
          error: false,
          results,
        });
      });
    }
  }

  renderResult(result, index) {
    return (<Thumbnail
              key={index}
              href={result.href}
              src={result.src}
              alt={result.title}
              title={result.title}
              height={result.height}
              width={result.width}
              />);
  }

  render() {
    const
      { results } = this.state,
      offsetY = parseInt(this.props.offsetY, 10) || 0;

    return (
      <div style={{marginTop: offsetY}} className={classnames('image-search-results', this.props.className)}>
        {_map(results, this.renderResult)}
      </div>
    );
  }
}


export default ModelImages;
