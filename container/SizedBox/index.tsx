import { PropsWithChildren } from "react"
import styles from './styles.module.scss'

type PropsType = PropsWithChildren<any>

const SizedBox: React.FC<PropsType> = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default SizedBox