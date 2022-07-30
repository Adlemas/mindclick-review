import { message } from "antd"
import { useEffect, useRef, useState } from "react"
import axios from "../api/axios"
import { DivideSettings, STAGE, Statistic } from "../types"
import handleAxiosError from "../utils/handleAxiosError"
import playSound from "../utils/playSound"


const useDivide = () => {
    const correctSound = useRef<HTMLAudioElement>(new Audio('/audio/line_open.mp3'))
    const incorrectSound = useRef<HTMLAudioElement>(new Audio('/audio/incorrect.mp3'))

    const [stage, setStage] = useState<STAGE>("LOADING")
    const [value, setValue] = useState<string>("")
    const expression = useRef<{ first: number, second: number }>({ first: null, second: null })

    const [expressions, setExpressions] = useState<Statistic[]>([])

    const [speed, setSpeed] = useState<number | null>(0.6)
    const [settings, setSettings] = useState<DivideSettings>({
        first: 'AB',
        second: 'C'
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
        if (expression.current === null || expression.current.first === null || expression.current.second === null) return

        const isRight = expression.current.first / expression.current.second === your

        setExpressions([
            ...expressions,
            {
                expression: [expression.current.first, expression.current.second],
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
            console.log('requesting')
            const { data, status } = await axios.post<{ first: number, second: number }>('/expression/divide', settings)

            console.log({data, status})

            setStage("ANSWER")

            if (status === 200) {
                expression.current = data
                setValue(`${expression.current.first} / ${expression.current.second}`)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    useEffect(() => {
        if (expression.current === null || expression.current.first === null || expression.current.second === null) {
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

export default useDivide