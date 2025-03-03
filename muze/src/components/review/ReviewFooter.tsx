import { Button } from "@/components/ui/button"

const ReviewFooter: React.FC = () => {
    return (
        <div className="flex justify-between items-center mt-1">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
                🧡 
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
                More ···
            </Button>
        </div>
    )
}

export default ReviewFooter;