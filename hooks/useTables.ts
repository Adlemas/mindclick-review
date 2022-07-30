import { message } from "antd"
import { useEffect, useRef, useState } from "react"
import axios from "../api/axios"
import { CountSettings, STAGE, Statistic } from "../types"
import handleAxiosError from "../utils/handleAxiosError"
import playSound from "../utils/playSound"


const useTables = () => {
    const correctSound = useRef<HTMLAudioElement>(new Audio('/audio/line_open.mp3'))
    const incorrectSound = useRef<HTMLAudioElement>(new Audio('/audio/incorrect.mp3'))

    const [stage, setStage] = useState<STAGE>("LOADING")
    const [value, setValue] = useState<number[] | null>(null)

    const [expressions, setExpressions] = useState<Statistic[]>([])

    const [speed, setSpeed] = useState<number | null>(1.5)
    const [settings, setSettings] = useState<CountSettings>({
        forceFormula: true,
        formula: 'NF',
        max: 4,
        min: 1,
        terms: 10
    })

    const [sounds, setSounds] = useState<boolean>(true)

    const [isRight, setIsRight] = useState<boolean>()

    const wait = (right: boolean) => {
        setIsRight(right)
        setStage('WAIT')
    }

    const play = (audio: HTMLAudioElement) => {
        if (sounds) playSound(audio)
    }

    const start = () => {
        setStage('ANSWER')
    }

    const answer = (your: number) => {
        if (value === null) return

        const isRight = value.reduce((previous, current) => previous + current) === your

        setExpressions([
            ...expressions,
            {
                expression: value,
                isRight: isRight,
                settings: Object.assign(settings, {})
            }
        ])

        if (isRight) {
            message.success("Правильно!")
            wait(true)
            play(correctSound.current)
            return true
        } else {
            message.error("Неправильно!")
            wait(false)
            play(incorrectSound.current)
            return false
        }
    }

    const request = () => {
        setStage('LOADING')
        requestExpression()
    }
    
    const requestExpression = async () => {
        try {
            const { data, status } = await axios.post<number[]>('/expression/mental', settings)

            setStage("ANSWER")

            if (status === 200) {
                setValue(data)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    useEffect(() => {
        if (value === null) {
            request()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        // State values
        stage, value, isRight, settings, speed, expressions, sounds,
        
        // Methods
        start, answer,
        wait, request,

        // State setters
        setSpeed,
        setSettings,
        setSounds
    }
}

export default useTables