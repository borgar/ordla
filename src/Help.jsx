import React from 'react';
import csx from 'classnames';
import css from './Help.css';

export default class Help extends React.PureComponent {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className={css.help}>
        <h2>Orðla</h2>

        <p>
          Giskaðu á <em>orðluna</em> í 6 tilraunum. Hver ágiskun {}
          þarf að vera 5 stafa orð. Eftir hverja tilraun mun litur {}
          flísanna breytast og sýna þér hvort hver stafur er í orðinu.
        </p>

        <div className={css.row}>
          <span className={csx(css.tile, css.correct)}>L</span>
          <span className={csx(css.tile)}>A</span>
          <span className={csx(css.tile)}>T</span>
          <span className={csx(css.tile)}>U</span>
          <span className={csx(css.tile)}>R</span>
        </div>

        <p>Stafurinn <b>L</b> er í orðinu og á réttum stað.</p>

        <div className={css.row}>
          <span className={csx(css.tile)}>M</span>
          <span className={csx(css.tile, css.present)}>E</span>
          <span className={csx(css.tile)}>Ð</span>
          <span className={csx(css.tile)}>A</span>
          <span className={csx(css.tile)}>L</span>
        </div>

        <p>Stafurinn <b>E</b> er í orðinu en er ekki á réttum stað.</p>

        <div className={css.row}>
          <span className={csx(css.tile)}>Ó</span>
          <span className={csx(css.tile)}>S</span>
          <span className={csx(css.tile)}>K</span>
          <span className={csx(css.tile, css.absent)}>Ý</span>
          <span className={csx(css.tile)}>R</span>
        </div>

        <p>Bókstafurinn <b>Ý</b> er ekki í orðinu.</p>

        <hr />

        <p>Ný <em>orðla</em> verður til á hverjum degi!</p>
      </div>
    );
  }
}
