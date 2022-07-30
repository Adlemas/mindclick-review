import Head from "next/head"
import LoginForm from "components/Login/LoginForm/index"
import LoginLayout from "components/Login/LoginLayout/index"

const Login: React.FC = () => {
    return (
        <LoginLayout>
            <>
                <Head>
                    <title>MindClick - Login</title>
                </Head>
                <LoginForm />
            </>
        </LoginLayout>
    )
}

export default Login
