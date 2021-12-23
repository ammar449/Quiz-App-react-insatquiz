import "./styles/style.scss";
import Home from "./components/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import QuizInstructions from "./components/quizz/QuizInstructions";
import Play from "./components/quizz/Play";
import QuizSummary from "./components/quizz/QuizSummary";
function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />{" "}
      <Route path="/play/instructions" component={QuizInstructions} />{" "}
      <Route path="/play/quiz" component={Play} />{" "}
      <Route path="/play/quiz-summary" component={QuizSummary} />{" "}
    </Router>
  );
}

export default App;
