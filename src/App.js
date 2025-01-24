import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import StudentList from "./components/StudentList";
import StudentEdit from "./components/StudentEdit";
import Home from "./components/Home";
import {Component} from "react";

class App extends Component {
 render(){
   return(
       <Router>
           <Routes>
               <Route path='/' element={<StudentList/>}/>
               <Route path='/students/:id' element={<StudentEdit/>}/>
           </Routes>
       </Router>
   )
 }
}
export default App;

