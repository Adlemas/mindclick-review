

import { createClient, createMicrophoneAndCameraTracks, ClientConfig } from 'agora-rtc-react'

const clientConfig: ClientConfig = {
    mode: 'rtc',
    codec: 'vp8',
    audioCodec: 'opus',
}

export const agoraConfig = {
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    appToken: process.env.NEXT_PUBLIC_AGORA_APP_TOKEN,
}

export const useClient = createClient(clientConfig)

export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()

export const channelName = 'main'