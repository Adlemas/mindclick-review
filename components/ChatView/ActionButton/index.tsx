import { Button } from "antd"
import classNames from "classnames"
import { ReactNode } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"

interface PropTypes {
    onClick?: () => void
    children?: ReactNode
    icon?: ReactNode
    selected?: boolean
    onContextMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

import styles from "./styles.module.scss"

const ActionButton: React.FC<PropTypes> = ({
    onClick,
    children,
    icon,
    selected,
    onContextMenu,
}) => {
    const { currentTheme } = useThemeSwitcher()

    return (
        <Button
            className={classNames(styles.action_btn, {
                [styles.action_btn__selected]: selected,
                [styles.action_btn__dark]: currentTheme === "dark",
            })}
            onContextMenu={onContextMenu}
            icon={icon}
            type="text"
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

export default ActionButton
