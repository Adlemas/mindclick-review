import { useRouter } from "next/router"


const ProgrammingSession: React.FC = () => {
    const router = useRouter()

    return (
        <div>
            Session code...
            {JSON.stringify(router.query)}
        </div>
    )
}

export default ProgrammingSession