import React from "react"
import classNames from "classnames"
import {useId} from "react-id-generator"

import style from "./style.module.scss"

const Radio = ({label, checked, disabled, onChange}) => {
    const [htmlId] = useId()
    const radioId = `radio-${htmlId}`

    return (
        <div className={classNames("radio", style.radio_button, {[style.disabled]: disabled})}>
            <div>
                <input
                    id={radioId}
                    onChange={onChange}
                    type="radio"
                    checked={checked}
                    disabled={disabled}
                />
                <label htmlFor={radioId}>{label}</label>
            </div>
        </div>
    )
}

export default Radio
