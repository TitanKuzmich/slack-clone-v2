import React from "react"

import Radio from "./index"

const RadioGroup = ({ value, items, className, onChange }) => {
  const changeHandle = (item) => {
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <div className={className}>
      {items.map((item) => (
        <Radio
            label={item.label}
            checked={value === item.value}
            onChange={() => changeHandle(item)}
            key={item.value}
        />
      ))}
    </div>
  )
}

export default RadioGroup
