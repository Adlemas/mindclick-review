import { useEffect, useState } from "react"

type Device = "desktop" | "mobile" | "tablet"

const useResponsive = () => {
    const [device, setDevice] = useState<Device>("desktop")

    useEffect(() => {
        const handleResize = (e: UIEvent) => {
            const width = window.innerWidth || window.outerWidth;
            if (width > 768 && width < 1280) setDevice('tablet')
            else if (width >= 1280) setDevice('desktop')
            else if (width <= 768) setDevice('mobile')
            else setDevice('desktop')
        }

        window.addEventListener('resize', handleResize)

        handleResize(null)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return device
}

export default useResponsive