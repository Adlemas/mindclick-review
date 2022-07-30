import { useEffect, useState } from "react"
import { useAppSelector } from "../slices"
import { selectAuth } from "../slices/auth"

const usePermission = () => {
    const { user } = useAppSelector(selectAuth)

    const [canAccess, setCanAccess] = useState<boolean>(Math.floor(Number(Object.values(user.balance.available)[0]) / 300) > 0)

    useEffect(() => {
        if (user) {
            setCanAccess(Math.floor(Number(Object.values(user.balance.available)[0]) / 300) > 0)
        }
    })

    return {
        canAccess
    }
}

export default usePermission
