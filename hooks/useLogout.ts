import { useCallback } from "react"
import { logoutAction } from "../slices/auth"
import { useAppDispatch } from "../slices/index"

const useLogout = () => {
    const dispatch = useAppDispatch()

    const logout = useCallback(() => {
        dispatch(logoutAction())
    }, [dispatch])

    return [logout]
}

export default useLogout