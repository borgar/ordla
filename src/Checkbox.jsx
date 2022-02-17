import React from 'react';
import PropTypes from 'prop-types';
import csx from 'classnames';
import css from './Checkbox.css';

export default function Checkbox ({ id, className, checked, disabled, onChange }) {
  return (
    <span
      className={csx(css.checkbox, className, checked && css.checked, disabled && css.disabled)}
      aria-labelledby={'label_' + id}
      role="checkbox"
      aria-checked={checked}
      tabIndex="0"
      onClick={() => {
        onChange && onChange(id, !checked, disabled);
      }}
      >
      <span className={css.toggle}>
        {checked ? <span className={css.glyph}>✔</span> : null}
        <span className={css.knob} />
      </span>
    </span>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
};
