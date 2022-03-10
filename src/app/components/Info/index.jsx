import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import cn from "classnames"
import { useId } from "react-id-generator"

import Icon from "components/Icon"

import style from "./style.module.scss"
import icons from "assets/svg"

const Info = ({ content, width, place }) => {
  const [htmlId] = useId()
  const [mouseOver, setMouseOver] = useState(true)

  const tooltipId = `tooltip-${htmlId}`
  const contentStyles = {}

  if (width) {
    contentStyles.width = width
  }

  return (
    <div data-tip="" data-for={tooltipId} className={style.info_wrapper}>
      <div
        onFocus={() => setMouseOver(true)}
        onMouseOver={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        <Icon icon={icons.Info} classIcon={style.info_icon} />
        {content && mouseOver && (
          <ReactTooltip
            place={place}
            arrowColor="#3f0f40"
            effect="solid"
            id={tooltipId}
            className={cn("info", style.tooltip, {
              [style.left_right_position]: place === "right" || place === "left",
              [style.bottom_position]: place === "bottom"
            })}
          >
            <div className={style.content} style={contentStyles}>
              {content}
            </div>
          </ReactTooltip>
        )}
      </div>
    </div>
  )
}

export default Info
