import 'whatwg-fetch';
import './App.css';
import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';

import React, { Component, PropTypes } from 'react';
import { Grid, Col, Row, ButtonGroup, Button, Media, Glyphicon } from 'react-bootstrap';
import Select from 'react-select';
import _keys from 'lodash/keys';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import _bindAll from 'lodash/bindAll';
import _each from 'lodash/each';
import _trim from 'lodash/trim';
import _bind from 'lodash/bind';
import _uniq from 'lodash/uniq';
import _filter from 'lodash/filter';

import naturalSortCmp from './natural-sort-cmp';
import { checkStatus } from './fetch-utilities';
import ModelInfo from './ModelInfo';
import ModelImages from './ModelImages';

const
  GROUPED_CHARS = new Set(['1','2','3','4','5','6','7','8','9','0', ]),
  GENERIC_SYMBOL_CHAR = '#';


class App extends Component {
  constructor(props) {
    super(props);

    _bindAll(this, 'handleOnChangeMake', 'renderLetterButton', 'renderModelRow', 'handleOnModelClick');

    this.state = {
      loading: false,
      models: {},
      error: undefined,
      selectedInitial: undefined,
      selectedMake: undefined,
      selectedModel: undefined,
      makeOptions: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true, });

    fetch('models.json')
      .then(checkStatus, (error) => { this.setState({ error, loading: false, }); return {}; })
      .then((data) => {
        const modelsByInitial = {};
        _each(data, function (models, make) {
          _each(models, function (years, model) {
            model = _trim(model);
            let initial = model[0].toUpperCase();

            if (GROUPED_CHARS.has(initial)) {
              initial = GENERIC_SYMBOL_CHAR;
            }

            if (!modelsByInitial[initial]) {
              modelsByInitial[initial] = [];
            }
            modelsByInitial[initial].push({ model, make, years, });
          });
        });
        _each(modelsByInitial, function (models, initial) {
          // modelsByInitial[initial] = _sortBy(models, 'model');
          modelsByInitial[initial] = models.sort(function (a, b) {
            return naturalSortCmp(a.model, b.model);
          });
        });
        this.setState({ loading: false, error: undefined, models: modelsByInitial, });
      });
  }

  handleOnChangeMake(selectedMake) {
    this.setState({
      selectedMake,
    });
  }

  handleOnChangeInitial(selectedInitial) {
    this.setState({
      selectedInitial,
      selectedMake: undefined,
      makeOptions: _map(
        _uniq(
          _map(
            this.state.models[selectedInitial],
            function (model) {
              return model.make;
            }
          )
        ).sort(),
        function (make) {
          return {
            value: make,
            label: make,
          };
        }
      ),
    });
  }

  handleOnModelClick(selectedModel) {
    this.setState({ selectedModel, });
  }

  renderLetterButton(letter) {
    return <Button key={letter} onClick={_bind(this.handleOnChangeInitial, this, letter)}>{letter}</Button>;
  }

  renderModelRow(model) {
    const { selectedModel } = this.state,
      isSelected = !!selectedModel && selectedModel.model == model.model;

    return (
      <Media className={isSelected ? 'active' : undefined} key={model.make+model.model} onClick={_bind(this.handleOnModelClick, this, model)}>
        <Media.Left>
          <Glyphicon glyph="picture"/>
        </Media.Left>
        <Media.Body>
          <Media.Heading>{model.model}</Media.Heading>
          <p>
            {model.make}
            {' '}
            <a className="google-images-link" href={`https://duckduckgo.com/?q=${encodeURIComponent(`!gi ${model.make} ${model.model}`)}`} target="_blank">Search Google Images</a>
          </p>
          <p className="text-muted">{model.years.join(', ')}</p>
          {isSelected && <ModelInfo model={model} />}
        </Media.Body>
      </Media>
    );
  }

  render() {
    const { loading, error, selectedInitial, models, makeOptions, selectedMake, selectedModel } = this.state;
    let modelList = models[selectedInitial];

    if (selectedMake) {
      modelList = _filter(modelList, function (model) { return model.make == selectedMake.value; });
    }

    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h1>Name My Sprint!</h1>
            <p className="help-text">
              Pick a letter and you'll get a list of cars whose model names
              start with that letter. Click on a model and you'll get a small
              description from Wikipedia and some images from Google.
            </p>
            <ButtonGroup>
              {_map(_keys(models).sort(), this.renderLetterButton)}
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {!!makeOptions.length &&
              <Select
                placeholder="Filter by make"
                options={makeOptions}
                value={selectedMake}
                onChange={this.handleOnChangeMake}
                />}
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            {!!selectedInitial && _map(modelList, this.renderModelRow)}
          </Col>
          <Col xs={6}>
            {!!selectedModel && <ModelImages query={selectedModel.make + ' ' + selectedModel.model} />}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
