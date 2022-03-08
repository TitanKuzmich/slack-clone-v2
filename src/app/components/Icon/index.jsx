import React from 'react'

const Icon = ({ onClick, classIcon, icon }) => {
  return (
    <svg className={classIcon} height="24" width="24" onClick={onClick}>
      <use xlinkHref={`#${icon}`} />
    </svg>
  )
}

export default Icon
