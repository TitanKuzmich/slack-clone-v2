import React from "react"

import Radio from "components/Radio"

const RadioGroupDynamic = ({ value, valueField, labelField, items, className, onChange }) => {
  const changeHandle = (item) => {
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <div className={className}>
      {items.map((item) => (
        <Radio
            label={item[labelField]}
            checked={value === item[valueField]}
            onChange={() => changeHandle(item)}
            key={item[valueField]}
        />
      ))}
    </div>
  )
}

export default RadioGroupDynamic
