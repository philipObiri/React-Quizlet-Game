function ProgressBar({index, numOfQuestions, points, maxPossiblePoints, answer}) {
    return (
        <header className="progress">
            <progress max={numOfQuestions} value={index + Number(answer !== null)}/>
            <p>Quesion <strong>{index}</strong>/{numOfQuestions}</p>
            <p><strong>{points}</strong>/{maxPossiblePoints}</p>
        </header>
    )
}

export default ProgressBar;
