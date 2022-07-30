import { Spin } from "antd"
import { useRouter } from "next/router"
import React from "react"
import { useAppSelector } from "../slices"
import { selectAuth } from "../slices/auth"

import Head from "next/head"

const Home: React.FC = () => {
    const router = useRouter()

    const { user } = useAppSelector(selectAuth)

    if (!user && !["STUDENT", "TEACHER"].includes(user.role)) {
        router.push("/login")
    }

    if (user.role === "TEACHER") {
        router.push("/teacher")
    } else {
        router.push("/student")
    }

    return (
        <>
            {/* Create Head component to set page title */}
            <Head>
                <title>MindClick - Загрузка</title>
            </Head>
            <Spin
                spinning
                tip="Загрузка..."
                size="large"
                style={{ maxHeight: "unset" }}
            >
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                    }}
                />
            </Spin>
        </>
    )
}

export default Home
