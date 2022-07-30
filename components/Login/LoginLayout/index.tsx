import React, { PropsWithChildren } from "react"
import Logo from "components/Logo"
import styles from "./styles.module.scss"

const LoginLayout: React.FC<PropsWithChildren<any>> = ({ children }) => {
    return (
        <main className={styles.login}>
            <div
                style={{
                    position: "absolute",
                    top: 30,
                    left: 30,
                }}
            >
                <Logo compact={false} height={100} />
            </div>

            <div>{children}</div>
        </main>
    )
}

export default LoginLayout
