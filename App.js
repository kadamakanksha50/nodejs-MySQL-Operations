import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dash from './component/Dash';
import Signin from './component/Signin';

function App(){
  return(
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' Component={Signin}></Route>
        <Route path='/dash' Component={Dash}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;