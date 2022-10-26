/* globals BUILD_ID */
import React from 'react';
import PropTypes from 'prop-types';
import Toaster from './Toaster.jsx';
import Checkbox from './Checkbox.jsx';
import { GAME_ONGOING } from './constants.js';
import css from './Settings.css';

export default class Settings extends React.PureComponent {
  static propTypes = {
    nr: PropTypes.number,
    settings: PropTypes.object,
    gameStatus: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  onChange = (key, value) => {
    const { settings } = this.props;
    let canChange = true;
    if (this.props.gameStatus === GAME_ONGOING) {
      if (key === 'hardMode' || key === 'handicap6') {
        canChange = false;
        this.toaster.toast('Læst á meðan leik stendur.', 1.5);
      }
    }
    if (canChange) {
      const newSettings = { ...settings };
      newSettings[key] = !!value;
      this.props.onChange(newSettings);
    }
  };

  renderSetting ({ label, id, help, inProgress = true }) {
    const { settings, gameStatus } = this.props;
    const isChecked = !!settings[id];
    const isDisabled = gameStatus === GAME_ONGOING && !inProgress;
    return (
      <p className={css.row}>
        <label id={'label_' + id} htmlFor={id}>{label}</label>
        <Checkbox
          id={id}
          className={css.checkbox}
          onChange={this.onChange}
          checked={isChecked}
          disabled={isDisabled}
          />
        {help ? <span className={css.help}>{help}</span> : null}
      </p>
    );
  }

  render () {
    return (
      <form className={css.settings}>
        <h2>Stillingar</h2>
        {this.renderSetting({
          label: 'Erfiðari viðureign',
          id: 'hardMode',
          help: 'Notast verður við alla þekkta stafi í ágiskunum.',
          inProgress: false
        })}
        {this.renderSetting({
          label: '6 stafa forgjöf',
          id: 'handicap6',
          help: 'Hægt er að hefja leikinn með 6 ónotaða stafi afhjúpaða. ' +
                'Þetta gerir erfiðleikastigið svipaðara og í ensku.',
          inProgress: false
        })}
        {this.renderSetting({
          label: '„Hefðbundið“ lyklaborð',
          id: 'qwerty',
          help: '„ERTY“ uppröðun á lyklaborði frekar en „AÁBD“ röð.',
          inProgress: true
        })}
        {this.renderSetting({
          label: 'Fjögurra raða lyklaborð',
          id: 'keys4',
          help: 'Lyklaborðið notar meira skjápláss en stafir eru stærri.',
          inProgress: true
        })}
        {this.renderSetting({
          label: 'Rökkurhamur',
          id: 'darkMode',
          help: 'Ljóst á dökkum bakgrunni.',
          inProgress: true
        })}
        {this.renderSetting({
          label: 'Litblinduhamur',
          id: 'colorblind',
          help: 'Nota liti sem hafa betri sýnileika fyrir litblinda.',
          inProgress: true
        })}
        <div className={css.info}>
          <p className={css.maker}>
            <span>Forritað af <a target="_blank" rel="noreferrer" href="https://twitter.com/borgar">@borgar</a>.</span> {}
            <span>Sendu honum <a target="_blank" rel="noreferrer" href="https://ko-fi.com/borgar"> smá ást</a>.</span>
          </p>
          <p className={css.build}>
            <small>#{this.props.nr}</small> {}
            <span>{BUILD_ID}</span>
          </p>
        </div>
        <Toaster ref={d => (this.toaster = d)} />
      </form>
    );
  }
}
