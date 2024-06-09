import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import TicTacToe from "./games/井字棋/index.jsx";
import Snake from "./games/贪吃蛇/index.jsx";
import Tetris from "./games/俄罗斯方块/index.jsx";
import Teyvat from "./games/提瓦特幸存者/index.jsx";

function App() {
  const { pathname } = useLocation();

  const gameList = [
    {
      name: '井字棋',
      component: <TicTacToe />,
      path: '/0'
    },
    {
      name: '贪吃蛇',
      component: <Snake />,
      path: '/1'
    },
    {
      name: '俄罗斯方块',
      component: <Tetris />,
      path: '/2'
    },
    {
      name: '提瓦特幸存者',
      component: <Teyvat />,
      path: '/3'
    }
  ]

  return (
    <div className='flex w-screen h-screen bg-gray-100 items-center justify-center'>
      <div className='w-40'>
        <ul className='flex flex-col space-y-2 justify-center items-center'>
          {
            gameList.map((item, index) => (
              <li key={index} className="w-full h-10">
                <Link to={item.path} className={`${pathname === '/' + index ? 'bg-blue-500' : 'bg-gray-200'} w-full h-10 rounded-md flex items-center justify-center cursor-pointer text-black hover:text-red-400`}>
                  {item.name}
                </Link>
              </li> 
            ))
          }
        </ul>
      </div>
      <div className='flex-1 ml-4 flex justify-center items-center flex-col'>
        <Routes>
          {
            gameList.map((item, index) => (
              <Route
                key={index}
                path={`/${index}`}
                element={item.component}
              />
            ))
          }
          <Route path="/" element={<Navigate to="/0"/>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
