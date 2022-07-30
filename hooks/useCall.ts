import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import { setInCall, setStarted, setUsers } from "slices/call"
import { useClient, useMicrophoneAndCameraTracks, agoraConfig, channelName } from "./agora"


const useCall = () => {
    const client = useClient()
    const { ready, tracks } = useMicrophoneAndCameraTracks()

    const { inCall, started, users } = useAppSelector(state => state.call)

    const dispatch = useAppDispatch()

    useEffect(() => {
        const init = async (name) => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType)

                // TODO: ignore media type, even add user without video
                if (mediaType === "video") {
                    dispatch(setUsers([...users, { ...user, pinned: false }]))
                }
                if (mediaType === "audio") {
                    user.audioTrack.play()
                }
            })

            client.on("user-unpublished", async (user, mediaType) => {
                // TODO: ignore media type, even add user without video
                if (mediaType === "audio") {
                    if (user.audioTrack) user.audioTrack.stop()
                }
                if (mediaType === "video") {
                    dispatch(setUsers(users.filter(u => u.uid !== user.uid)))
                }
            })

            try {
                await client.join(
                    agoraConfig.appId,
                    name,
                    agoraConfig.appToken,
                    null
                )
            } catch (error) {
                console.log(error)
            }

            if (tracks) await client.publish([tracks[0], tracks[1]])
            dispatch(setStarted(true))
            dispatch(setInCall(true))
        }


        if (ready && tracks) {
            try {
                init(channelName)
            } catch (error) {
                console.log(error)
            }
        }
    }, [channelName, client, ready, tracks])

    return {
        inCall,
        users,
        ready,
        tracks,
        started,
    }
}

export default useCall
