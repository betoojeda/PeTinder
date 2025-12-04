
import { motion, useMotionValue, useTransform } from "framer-motion";

const SwipeCard = ({ children, onSwipe }) => {
    const x = useMotionValue(0);

    const rotate = useTransform(x, [-200, 200], [-20, 20]);

    const handleDragEnd = () => {
        if (x.get() > 150) {
            onSwipe("right");
        } else if (x.get() < -150) {
            onSwipe("left");
        }
    };

    return (
        <motion.div
            style={{
                x,
                rotate,
                touchAction: "none",
                cursor: "grab",
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="swipe-card"
        >
            {children}
        </motion.div>
    );
};

export default SwipeCard;
