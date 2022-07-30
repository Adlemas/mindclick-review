

import { useEffect, useRef, useState } from "react";
import { STAGE, Statistic, User } from "../types";
import useResponsive from "./useResponsive";


export interface Listener {
    key: string;
    state: STAGE;

    history: Statistic[];
    member: User;
    sounds: boolean;
    focused: boolean;

    start: () => void;
    request: () => void;
    focus: () => void;
    enableSounds: () => void;
    disableSounds: () => void;
}

interface Listeners {
    [key: string]: Listener;
}

interface HookTypes {
    answerModal: () => void;

    maxScreens?: number;
}

export type useControllerProps = {
    subscribe: (listener: Listener) => void;
    unsubcribe: (key: string) => void;

    listeners: Listeners;
    screens: number;

    addScreen: () => void;
    decreaseScreen: () => void;
}

const useController = ({ answerModal, maxScreens = 6 }: HookTypes): useControllerProps => {
    const listeners = useRef<Listeners>({})
    const [screens, setScreens] = useState<number>(1)
    const device = useResponsive()

    const anyChange = () => {
        let allWaiting = true
        let allBlured = Object.values(listeners.current).filter((listener) => listener.focused).length <= 0
        let focused = false
        Object.values(listeners.current).forEach(listener => {
            if (listener.state !== 'WAIT') allWaiting = false
            if (listener.state === 'ANSWER' && !focused && listener.focus && allBlured) {
                focused = true
                listener.focus()
            }
        })

        if (allWaiting) {
            Object.values(listeners.current).forEach(listener => listener.request())
            answerModal()
        }
    }

    useEffect(() => {
        const keyPressHandler = (ev: KeyboardEvent) => {
            Object.values(listeners.current).forEach(listener => {
                if (ev.key !== 'Enter') return
                if (listener.state === 'START' && listener.start) listener.start()
            })
        }

        window.addEventListener('keyup', keyPressHandler)

        return () => window.removeEventListener('keyup', keyPressHandler)
    }, [])

    const subscribe = (listener: Listener) => {
        listeners.current[listener.key] = listener
        anyChange()
    }

    const unsubcribe = (key: string) => {
        if (listeners.current[key]) {
            delete listeners.current[key]
        }
    }

    useEffect(() => {
        if (Object.keys(listeners.current).length > 1) {
            // Disable sounds for every screen except first screen
            Object.values(listeners.current)[0].enableSounds()
            Object.values(listeners.current).slice(1).forEach((listener) => listener.disableSounds())
        }
    }, [screens])

    return {
        subscribe, unsubcribe,
        addScreen: () => setScreens(device === 'mobile' ? 1 : Math.min(maxScreens || 6, screens + 1)),
        decreaseScreen: () => setScreens(device === 'mobile' ? 1 : Math.max(1, screens - 1)),

        listeners: listeners.current,
        screens,
    }
}

export default useController