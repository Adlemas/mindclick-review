import React from "react"
import logo from "assets/mindclickon.svg"
import icon from "assets/mindclickon-icon.png"
import { Image, ImageProps } from "antd"

interface PropTypes extends ImageProps {
    compact: boolean
}

const Logo: React.FC<PropTypes> = ({ compact, ...props }) => {
    return (
        <Image
            src={compact ? icon.src : logo.src}
            preview={false}
            alt={"Logo"}
            {...props}
        />
    )
}

export default Logo
