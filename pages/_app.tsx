import { Spin } from "antd"
import { NextComponentType } from "next"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { Provider } from "react-redux"
import useLogout from "../hooks/useLogout"
import {
    getAuthUserAction,
    refreshUserAction,
    selectAuth,
    setNextPage,
} from "../slices/auth"
import { store, useAppDispatch, useAppSelector } from "../slices/index"
import "../styles/global.scss"
import { getItemFromLocal } from "../utils/localStorage"

import { ThemeSwitcherProvider } from "react-css-theme-switcher"

import { ConfigProvider } from "antd"
import ruRU from "antd/lib/locale/ru_RU"

const themes = {
    dark: `/dark-theme.css`,
    light: `/light-theme.css`,
}

import "moment/locale/ru"
import { Content } from "antd/lib/layout/layout"
import useSocket from "hooks/useSocket"
import openNotification from "hooks/notification"
import { SocketMessage, SocketNotification } from "types"
import useNotification from "hooks/notification"
import ProfilePic from "components/ProfilePic"
import { getChannelMessagesAction } from "slices/singleChat"

const App: React.FC<{ Component: NextComponentType; pageProps: any }> = ({
    Component,
    pageProps,
}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isAuthenticated, loading, user, next } = useAppSelector(selectAuth)

    const [logout] = useLogout()

    const isLoginPage = router.pathname.includes("/login")

    // const localIsAuthenticated = getItemFromLocal("isAuthenticated")
    const localIsAuthenticated = getItemFromLocal("isAuthenticated")
    const refreshing = localIsAuthenticated === true && isAuthenticated !== true

    const socket = useSocket()
    const { channel } = useAppSelector((state) => state.singleChat)

    useEffect(() => {
        if (refreshing) {
            if (!loading) {
                dispatch(refreshUserAction())
            }
            return
        }

        if (!isAuthenticated && !isLoginPage) {
            dispatch(setNextPage(router.pathname))
            router.push("/login")
        }
        if (isAuthenticated && isLoginPage) {
            if (
                next &&
                ((next.includes("teacher") && user.role !== "TEACHER") ||
                    (next.includes("student") && user.role !== "STUDENT"))
            ) {
                router.push("/")
                return
            }
            router.push(next.replace("/[id]", "") || "/")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        isAuthenticated,
        isLoginPage,
        loading,
        localIsAuthenticated,
        next,
        refreshing,
        router,
    ])

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getAuthUserAction())
        }
    }, [isAuthenticated, dispatch])

    const { openNotification, handleNewMessage } = useNotification()

    useEffect(() => {
        if (isAuthenticated && user !== null && socket !== null) {
            socket.on("message", (message: SocketNotification) => {
                openNotification({
                    title: message.title,
                    message: message.description,
                    icon: <ProfilePic userId={message.fromId} />,
                    next: message.next
                        ? message.next.replace("$role", user.role.toLowerCase())
                        : null,
                })
            })
            // socket.on("messageMeta", (message: SocketMessage) => {
            //     handleNewMessage(message)
            // })
            // handle socket connection
            socket.on("connect", () => {
                console.log("connected")
            })
            // handle socket disconnection
            socket.on("disconnect", () => {
                console.log("disconnected")
            })
            // handle socket connection error
            socket.on("connect_error", () => {
                console.log("connect_error")
            })
        }

        return () => {
            console.log("SOCKET CLOSING")
            socket?.close()
        }
    }, [dispatch, isAuthenticated, socket])

    /**
     * Use Effect Hook to logout user on session expiration.
     *
     * @returns {void} - Calls logout to logout user on session expiration.
     */

    useEffect(() => {
        window.addEventListener("forceLogout", logout)

        return () => {
            window.removeEventListener("forceLogout", logout)
        }
    }, [logout])

    if (refreshing) {
        return (
            <Spin
                spinning
                tip="Загрузка..."
                size="large"
                style={{ maxHeight: "unset" }}
            >
                <Content
                    style={{
                        width: "100vw",
                        height: "100vh",
                    }}
                />
            </Spin>
        )
    }

    return (
        <>
            {!isLoginPage ? (
                localIsAuthenticated !== true ? null : (
                    <Component {...pageProps} />
                )
            ) : (
                <Component {...pageProps} />
            )}
        </>
    )
}

function AppWrapper({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <ThemeSwitcherProvider
                themeMap={themes}
                defaultTheme={getItemFromLocal("theme") || "light"}
            >
                <ConfigProvider locale={ruRU}>
                    <App Component={Component} pageProps={pageProps} />
                </ConfigProvider>
            </ThemeSwitcherProvider>
        </Provider>
    )
}
export default AppWrapper
