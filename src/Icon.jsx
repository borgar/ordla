import React from 'react';
import PropTypes from 'prop-types';

export default function Icon ({ name, size }) {
  return (
    <span
      className="material-icons-sharp"
      style={{ fontSize: size ? size + 'px' : null }}
      >
      {name}
    </span>
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};
