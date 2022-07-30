import { useEffect, useRef, useState } from "react"
import { STAGE, Statistic } from "../types";

import { message } from "antd";
import playSound from "../utils/playSound";

const useFlashCards = () => {

    const [expressions, setExpressions] = useState<Statistic[]>([])
    const [stage, setStage] = useState<STAGE>("LOADING")
    const [sounds, setSounds] = useState<boolean>(true)

    const [isRight, setIsRight] = useState<boolean>(false)

    const correctSound = useRef<HTMLAudioElement>(new Audio('/audio/line_open.mp3'))
    const incorrectSound = useRef<HTMLAudioElement>(new Audio('/audio/incorrect.mp3'))

    const [digitNumber, setDigitNumber] = useState<number>(3)
    const [value, setValue] = useState<number>(0)

    const [animated, setAnimated] = useState<boolean>(true)

    const [currentItem, setCurrentItem] = useState<number>(0)

    const generate = () => {
        setValue(Math.max(Math.floor(Math.random() * Number('9'.repeat(digitNumber))), Number((Number(Math.floor(Math.random() * 2)) + 1).toString().repeat(digitNumber))))
    }

    const start = () => {
        setIsRight(false)

        generate()
    }

    const play = (audio: HTMLAudioElement) => {
        if (sounds) playSound(audio)
    }

    const answer = (your: number) => {
        setExpressions([...expressions, {
            expression: [value],
            isRight: your === value,
            settings: {
                digitNumber
            }
        }])

        if (your === value) {
            setIsRight(true)
            message.success('Правильно!')
            play(correctSound.current)
        } else {
            setIsRight(false)
            message.error('Неправильно!')
            play(incorrectSound.current)
        }

        generate()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => generate, [])

    return {
        expressions, stage, sounds, isRight, value, animated, currentItem,

        answer, start, 
        
        setSounds, setDigitNumber, setStage, setAnimated, setCurrentItem,
    }

}

export default useFlashCards
