import React from "react"
import {useId} from "react-id-generator"
import cn from "classnames"

import style from "./style.m.scss"

const Checkbox = ({label, labelClassName, disabled, indeterminate, onChange, data, ...rest}) => {
    const [htmlId] = useId()
    const checkboxId = `checkbox-${htmlId}`

    const changeHandle = (e) => {
        if (disabled) {
            return false
        }

        onChange(e.currentTarget.checked, data.id)
        return true
    }

    return (
        <div className={cn("checkbox", style.checkbox, {[style.disabled]: disabled})}>
            <input
                id={checkboxId}
                type="checkbox"
                onChange={changeHandle}
                disabled={disabled}
                ref={
                    (checkbox) => checkbox && (checkbox.indeterminate = indeterminate)
                }
                {...rest}
            />

            <label htmlFor={checkboxId}>{label} </label>
        </div>
    )
}

export default Checkbox
