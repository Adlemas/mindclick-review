import { useRef, useState, useEffect } from "react"
import { STAGE } from "types"
import item1 from "assets/flashcards/item.png"
import item2 from "assets/flashcards/item2.png"
import item3 from "assets/flashcards/item3.png"
import item4 from "assets/flashcards/item4.png"
import item5 from "assets/flashcards/item5.png"
import item6 from "assets/flashcards/item6.png"
import item7 from "assets/flashcards/item9.png"
import item8 from "assets/flashcards/item10.png"

import treeImg from "assets/flashcards/tree.png"
import useResponsive from "hooks/useResponsive"

const items = [
    item1.src,
    item2.src,
    item3.src,
    item4.src,
    item5.src,
    item6.src,
    item7.src,
    item8.src,
]

interface PropTypes {
    value: number
    animated: boolean
    itemStyle: number

    setStage: (state: STAGE) => void
}

const FlashCard: React.FC<PropTypes> = ({
    value,
    animated,
    setStage,
    itemStyle = 0,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const device = useResponsive()

    // Private (For generation)
    const ctx = useRef<CanvasRenderingContext2D | null>(null)
    const loadedImages = useRef(0)
    const itemsRef = useRef<HTMLImageElement[]>([])
    const tree = useRef<HTMLImageElement>(new Image())

    const [imagesLoaded, setImagesLoaded] = useState(false)

    // ----

    function imageLoaded() {
        loadedImages.current++

        if (loadedImages.current >= items.length + 1 /* tree */) {
            setImagesLoaded(true)
            setStage("ANSWER")
            start()
        }
    }

    const initTreeImage = ({ height: renderHeight }) => {
        tree.current.src = treeImg.src
        tree.current.onload = () => {
            const { width: original_width, height: original_height } =
                tree.current

            // Change size
            const offset = renderHeight / original_height
            const w = original_width * offset
            const h = original_height * offset

            tree.current.width = w
            tree.current.height = h

            imageLoaded()
        }
    }

    const initItems = () => {
        for (const itemImageSrc of items) {
            const itemImage = new Image()
            itemImage.src = itemImageSrc

            // eslint-disable-next-line no-loop-func
            itemImage.onload = () => {
                itemImage.width = 75
                itemImage.height = 55

                itemsRef.current.push(itemImage)

                imageLoaded()
            }
        }
    }

    useEffect(() => {
        if (device === "mobile") {
            tree.current.width = 50
            itemsRef.current.forEach((item, index) => {
                itemsRef.current[index].width = 40
                itemsRef.current[index].height = 30
            })
        }

        setStage("LOADING")
        if (canvasRef.current) {
            const cnv = canvasRef.current
            ctx.current = cnv.getContext("2d")

            initTreeImage({ height: device === "mobile" ? 250 : 400 })
            initItems()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasRef, device])

    const start = () => {
        reinit(canvasRef.current)

        if (animated) generateNumberWithAnimation()
        else generateNumber()
    }

    useEffect(() => {
        if (imagesLoaded && value) {
            start()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, imagesLoaded])

    function drawTree({ pos_x }) {
        ctx.current.drawImage(
            tree.current,
            pos_x * tree.current.width,
            0,
            tree.current.width,
            tree.current.height
        )
    }

    function drawItem({ x, y }) {
        const item = itemsRef.current[itemStyle]
        ctx.current.drawImage(
            item,
            x * tree.current.width +
                (tree.current.width / 2 - item.width / 2 + 1),
            y,
            item.width,
            item.height
        )
    }

    function drawDigit({ num, pos_x, frame }) {
        const item = itemsRef.current[itemStyle]
        if (num >= 5) {
            drawItem({
                x: pos_x,
                y: !frame
                    ? device === "mobile"
                        ? 67
                        : 108 - item.height
                    : (device === "mobile" ? 67 : 108 - (40 - frame)) -
                      item.height,
            })
        } else {
            drawItem({
                x: pos_x,
                y: 5,
            })
        }
        const prepared = num >= 5 ? num - 5 : num
        for (let i = 0; i < prepared; i++) {
            drawItem({
                x: pos_x,
                y: !frame
                    ? (device === "mobile" ? 85 : 105 + 28) + i * item.height
                    : (device === "mobile" ? 85 : 105 + 28 + (40 - frame)) +
                      i * item.height,
            })
        }

        for (let i = 0; i < 4 - prepared; i++) {
            drawItem({
                x: pos_x,
                y: tree.current.height - item.height - i * item.height,
            })
        }
    }

    function drawBasic() {
        for (let i = 0; i < value.toString().length; i++) {
            drawTree({ pos_x: i })
        }
    }

    function drawNumber(num, frame = null) {
        const num_str =
            num.toString().length === value.toString().length
                ? num.toString()
                : "0".repeat(value.toString().length - num.toString().length) +
                  num.toString()

        let pos_x = value.toString().length - 1
        for (let digit_str of num_str.split("").reverse().join("")) {
            drawDigit({
                num: Number(digit_str),
                pos_x: pos_x,
                frame: frame,
            })
            pos_x--
        }
    }

    function generateNumber() {
        ctx.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        )
        drawBasic()

        drawNumber(value)
    }

    function generateNumberWithAnimation() {
        let f = 1

        function frame() {
            ctx.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            )

            drawBasic()

            drawNumber(value, f)

            f++

            if (f < 40) requestAnimationFrame(frame)
        }

        requestAnimationFrame(frame)
    }

    const initSize = (cnv, { width, height }) => {
        cnv.width = width
        cnv.height = height
        cnv.style.width = `${width}px`
        cnv.style.height = `${height}px`
    }

    function reinit(cnv) {
        initSize(cnv, {
            width: tree.current.width * value.toString().length,
            height: device === "mobile" ? 250 : 400,
        })
    }

    return <canvas ref={canvasRef}></canvas>
}

export default FlashCard
