import { useEffect, useState } from "react";
import { STAGE, Statistic } from "../types";


export interface MentalListener {
    key: string;
    state: STAGE;

    history: Statistic;
    member: string; // member name
    onAnswer?: (isRight: boolean) => void;
}

interface Listeners {
    [key: string]: MentalListener;
}

interface HookTypes {
    answerModal: () => void;
}

export type useMentalScreenController = {
    subscribe: (listener: MentalListener) => void;
    unsubcribe: (key: string) => void;
    listeners: Listeners;
}

const useMentalScreen = ({ answerModal }: HookTypes): useMentalScreenController => {
    const [listeners, setListeners] = useState<Listeners>({})

    useEffect(() => {
        let allWaiting = true
        Object.values(listeners).forEach(listener => {
            if (listener.state !== 'WAIT') allWaiting = false
        })

        if (allWaiting) {
            answerModal()
        }
    }, [listeners])

    const handleStateChange = (key: string, state: STAGE) => {
        if (!listeners[key]) return

        setListeners({
            ...listeners,
            [key]: {
                ...listeners[key],
                state
            }
        })
    }

    const handleAnswer = (key: string, isRight: boolean) => {

    }

    const subscribe = (listener: MentalListener) => {
        listener.onAnswer = (isRight) => handleAnswer(listener.key, isRight)

        setListeners({
            ...listeners,
            [listener.key]: listener
        })
    }

    const unsubcribe = (key: string) => {
        if (listeners[key]) {
            const temp = Object.assign(listeners, {})
            delete temp[key]
            setListeners(temp)
        }
    }

    return {
        subscribe, unsubcribe,
        
        listeners
    }
}

export default useMentalScreen