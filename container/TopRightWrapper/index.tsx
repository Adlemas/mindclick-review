import styles from "./styles.module.scss"

/**
 * Create PropTypes interface for TopRightWrapper
 */
interface PropTypes {
    children: React.ReactNode
}

/**
 * Create react functional component for TopRightWrapper
 * that gets children props and renders them inside a div with className styles.top_right_wrapper
 */
const TopRightWrapper: React.FC<PropTypes> = ({ children }) => {
    return <div className={styles.top_right_wrapper}>{children}</div>
}

export default TopRightWrapper
