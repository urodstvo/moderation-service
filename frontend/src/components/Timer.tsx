import { useCountDown } from "@/hooks";
import { iTimerProps } from "@/interfaces";

const Timer = ({ seconds, className = '', callback } : iTimerProps) => {
    const timer = useCountDown(seconds);

    if (timer > 0)
        return <div className={className}> {timer} seconds left </div>
    else { 
        if (!!callback) callback();
        return <div className={className}> time is over</div>
    }

};

export default Timer;