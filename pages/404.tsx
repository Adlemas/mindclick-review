import { Button } from 'antd'
import styles from '../styles/components/404.module.scss'

const Error: React.FC = () => {
    return (
        <div className={styles.root}>
            <h1>404</h1>
            <hr />
            <h3>Страница не найдена</h3>
            <Button type='dashed' href='/'>
            НА ГЛАВНУЮ
            </Button>
        </div>
    )
}

export default Error