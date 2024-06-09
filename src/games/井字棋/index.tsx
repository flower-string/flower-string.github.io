import { useRef, useState } from "react"
import { useEffect } from "react";

function TicTacToe() {
  const TicTacToeRef = useRef<HTMLCanvasElement>(null);
  const [xCount, setXCount] = useState<number>(0);
  const [oCount, setOCount] = useState<number>(0);
  // const [player, setPlayer] = useState<'X' | 'O'>('X');
  let player = 'X';
  useEffect(() => {
    draw()
  }, [])

  const pieces = new Array(3).fill(null)
  .map(() => new Array(3).fill(null))
  
  function draw() {
    
    const ctx = TicTacToeRef.current?.getContext('2d');
    if(!ctx) {
      return;
    }
    // 绘制棋盘
    ctx.clearRect(0, 0, 400, 400);
    for(let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(50 + i * 100, 50)
      ctx.lineTo(50 + i * 100, 350)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.moveTo(50, 50 + i * 100)
      ctx.lineTo(350, 50 + i * 100)
      ctx.stroke()
      ctx.closePath()
    }

    // 绘制棋子
    for(let i = 0; i < 3; i++) {
      if(!pieces[i]) {
        continue;
      }
      for(let j = 0; j < 3; j++) {
        if(!pieces[i][j]) {
          continue;
        }
        drawChessPiece(ctx, j, i, pieces[i][j]);
      }
    }

    function drawChessPiece(ctx: any, x: number, y: number, type: string) {
      ctx.font = '50px Arial';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      if (type === 'X') {
        ctx.fillText('X', 100 + x * 100, 100 + y * 100);
      } else {    
        ctx.fillText('O', 100 + x * 100, 100 + y * 100);
      }
    }
  }

  function isWin() {
    console.log("判别胜负");
    console.log(pieces);
    
    for(let i = 0; i < 3; i++) {
      // 横向
      if(pieces[i][0] && pieces[i][0] === pieces[i][1] && pieces[i][0] === pieces[i][2]) {
        return true;
      }
      // 纵向
      if(pieces[0][i] && pieces[0][i] === pieces[1][i] && pieces[0][i] === pieces[2][i]) {
        return true;
      }
    }
    // 斜向
    if(pieces[1][1] && (pieces[1][1] === pieces[0][0] && pieces[1][1] === pieces[2][2] || pieces[1][1] === pieces[0][2] && pieces[1][1] === pieces[2][0])) {
      return true;
    }
    return false;
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if(!TicTacToeRef.current) {
      return;
    }
    const x = e.clientX - TicTacToeRef.current?.offsetLeft;
    const y = e.clientY - TicTacToeRef.current?.offsetTop;
    const px = Math.floor((x - 50) / 100);
    const py = Math.floor((y - 50) / 100);
    
    if(px < 0 || px > 2 || py < 0 || py > 2) {
      return;
    }
    
    if(pieces[py][px]) {
      return;
    }
    
    pieces[py][px] = player;
    
    draw();

    if(isWin()) {
      console.log(`${player} 获胜`);
      if(player === 'X') {
        setXCount(xCount => xCount + 1)
      } else {
        setOCount(oCount => oCount + 1)
      }

      console.log(pieces);
      
      return;
    }

    if(player === 'X') {
      player = 'O';
    } else {
      player = 'X';
    }
  }

  return (
    <>
      <h1>井字棋</h1>
      <h2>当前玩家：{player}</h2>

      <h2>玩家得分
        <ul>
          <li>X: {xCount.toString()}</li>
          <li>O: {oCount.toString()}</li>
        </ul>
      </h2>

      <canvas ref={TicTacToeRef} width={400} height={400} onClick={handleClick}></canvas>
    </>
  )
}

export default TicTacToe