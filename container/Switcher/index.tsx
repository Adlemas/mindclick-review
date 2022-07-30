import React, { ReactElement } from "react"
import useResponsive from "hooks/useResponsive"

interface SwitchItem<T> {
    key: T
    render: ReactElement
}

interface PropTypes<T> {
    selected: T
    items: SwitchItem<T>[]
}

const Switcher: React.FC<PropTypes<string>> = ({ selected, items }) => {
    const device = useResponsive()

    const selectedItems = items.filter((item) => item.key === selected)

    if (selectedItems.length) {
        return device === "mobile" ? (
            <div
                style={{
                    marginTop: "6rem",
                }}
            >
                {selectedItems[0].render}
            </div>
        ) : (
            selectedItems[0].render
        )
    } else {
        return <div></div>
    }
}

export default Switcher
