import {motion} from "framer-motion"
function FlashCard(){
        return(
            <>
               <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="p-6 bg-white rounded-xl shadow"
                >
                FlashCards
                </motion.div>
            </>
        )
}
export default FlashCard;
