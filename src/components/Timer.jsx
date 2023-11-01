import { useEffect } from "react";


function Timer({dispatch, secondsRemaining}) {

    const minutes = Math.floor(secondsRemaining/60);
    const seconds = secondsRemaining % 60;

    useEffect(function(){
        // a timer or countdown component 
        const id = setInterval(function(){
            dispatch({type:"tick"})
        }, 1000);

        // a clean up "callback" function that clears the previous timer on each question upon restart
        return ()=>clearInterval(id);
    },

    [dispatch]
    
    );

    return (
        <div className="timer">
        {minutes <10 && "0"}
        {minutes}
        :
        {seconds <10 && "0" }
        {seconds}
  
        </div>
    )
}

export default Timer;
