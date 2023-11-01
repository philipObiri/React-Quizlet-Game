import { useEffect, useReducer } from "react";
import Main from "./components/Main";
import Error from "./components/Error";
import Header from "./components/Header";
import Loader from "./components/Loader";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Timer from "./components/Timer";
import NextButton from "./components/NextButton";
import ProgressBar from "./components/ProgressBar";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";


const SECONDS_PER_QUESTION = 5;

const initialState = {
  questions: [],

  //each question can be in one of the following status:  "loading", "error", "ready", "active", "finished"
  status: "loading",

  index: 0,

  answer: null,

  points: 0,

  highscore: 0,

  secondsRemaining:null,
};


function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      }

    case "dataFailed":
      return {
        ...state,
        status: "error"
      }

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      }

    case "newAnswer":
      // get the current question 
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points
      }

    case "nextQuestion":
      return {
        ...state,
        // increment the index of the question to move to the next question in the questions array :
        index: state.index + 1, answer: null
      }

    case "finish":
      return {
        ...state,
        status: "finished",

        // if the user's points is greater than the highscore ; Set the high score 
        highscore: state.points > state.highscore ? state.points : state.highscore
      }

    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: "ready"
      }

    case "tick":
      return{
        ...state,
        secondsRemaining: state.secondsRemaining -1 ,
        status: state.secondsRemaining === 0 ? "finished": state.status, 
      }

    default:
      throw new Error("Action Unknown");
  }
}

function App() {
  // Create and handle state with the useReducer:
  const [{ questions, status, index, answer, points, highscore,secondsRemaining }, dispatch] = useReducer(reducer, initialState);

  //destructure the state :
  // const { questions, status,  index } = state;

  // the total number of questions :
  const numOfQuestions = questions.length;

  // A reducer function to calculate the total number of points for all the questions :
  const maxPossiblePoints = questions.reduce((previousQuestionPoint, currentQuestionPoint) => previousQuestionPoint + currentQuestionPoint.points, 0);

  // Loading the questions data from the API 
  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res => res.json()))
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch(error => dispatch({ type: "dataFailed" }));
  }, []
  
  );

  return (
    <div className="app">
      <Header />
      <Main>
        {
          // Display a Loading animation if the questions are being loaded 
          status === "loading" && <Loader />
        }

        {
          // Display an error message if the questions were not able to load
          status === "error" && <Error />
        }

        {
          // Display a welcome splash screen if the questions were able to load successfully;
          status === "ready" && <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch} />
        }

        {
          // Display a welcome splash screen if the questions were able to load successfully;
          status === "active" &&
          <>
            <ProgressBar
              index={index + 1}
              numOfQuestions={numOfQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <Timer dispatch={dispatch}  secondsRemaining={secondsRemaining}/>
              <NextButton dispatch={dispatch} answer={answer} index={index} numOfQuestions={numOfQuestions} />
            </Footer>
          </>}
          {status === "finished" && (<FinishScreen dispatch={dispatch} points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} />)}
      </Main>
    </div>
  )
}

export default App;
