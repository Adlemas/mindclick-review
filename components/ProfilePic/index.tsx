import { UserOutlined } from "@ant-design/icons"
import { Avatar, Badge } from "antd"
import { CSSProperties } from "react"
import { useEffect, useState } from "react"
import axios from "api/axios"

interface PropTypes {
    src?: string
    size?: number
    userId?: string
    style?: CSSProperties

    online?: boolean
}

const ProfilePic: React.FC<PropTypes> = ({
    src,
    userId,
    size,
    style,
    online,
}) => {
    const [imgURL, setImgURL] = useState<string | null>(null)
    const [error, setError] = useState<boolean>(false)

    const getProfile = async () => {
        try {
            const { data, status } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}${
                    userId ? `profile/${userId}` : `portfolio/${src}`
                }`,
                {
                    responseType: "blob",
                }
            )

            if (status === 200) {
                const dataURL = URL.createObjectURL(
                    new Blob([data], {
                        type: "image/*",
                    })
                )
                setImgURL(dataURL)
            } else {
                setError(true)
            }
        } catch (err: any) {
            setError(true)
        }
    }

    useEffect(() => {
        if ((src || userId) && !error && !imgURL) {
            getProfile()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, userId])

    return (
        <Badge dot={online} color={"#3FC250"}>
            <Avatar
                style={style}
                icon={<UserOutlined />}
                src={imgURL}
                size={size}
            />
        </Badge>
    )
}

export default ProfilePic
