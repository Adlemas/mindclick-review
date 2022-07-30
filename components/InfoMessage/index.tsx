import { ReactNode } from "react"

import styles from "./styles.module.scss"

interface PropTypes {
    children: ReactNode
}

const InfoMessage: React.FC<PropTypes> = ({ children }) => {
    return <div className={styles.info_message}>{children}</div>
}

export default InfoMessage
