import { useState, useRef, useEffect } from "react"

function Snakes() {
  const SIZE = 20;

  class Node {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }

  class Food {
    x: number;
    y: number;
    static hase: boolean = true;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }

  const [count, setCount] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const direction = useRef<'left' | 'right' | 'up' | 'down'>('right');

  const gameState = useRef<'running' | 'paused'>('running');
  let g = useRef<number>(0);
  let food: Food | null = null;

  function createFood(): Food {
    const x = Math.floor(Math.random() * 30);
    const y = Math.floor(Math.random() * 30);
    if(snack.current.find((node) => node.x === x && node.y === y)) {
      return createFood();
    }
    return new Food(x, y);
  }

  let snack = useRef<Node[]>([
    new Node(3, 0),
    new Node(2, 0),
    new Node(1, 0),
    new Node(0, 0),
  ])

  function snackMove() {
    const head = snack.current[0];
    const newHead = createHead(head, direction.current);

    // 是否越界
    if(newHead.x < 0 || newHead.x > 29 || newHead.y < 0 || newHead.y > 29) {
      // 游戏结束
      gameState.current = 'paused';
      return;
    }

    // 是否吃到自己
    if(snack.current.find((node) => node.x === newHead.x && node.y === newHead.y)) {
      // 游戏结束
      console.log(snack, direction.current);
      gameState.current = 'paused';
      return;
    }

    snack.current.unshift(newHead);
    const last = snack.current.pop();

    if(!food) {
      return;
    }

    // 吃到食物
    if(newHead.x === food.x && newHead.y === food.y) {
      console.log('eat food');
      setCount(count => count + 1);
      food = createFood();
      if(last) {
        snack.current.push(last);
      }
      return;
    }

    function createHead(head: Node, dir: 'left' | 'right' | 'up' | 'down') {
      switch(dir) {
        case 'left':
          return { x: head.x - 1, y: head.y };
        case 'right':
          return { x: head.x + 1, y: head.y };
        case 'up':
          return { x: head.x, y: head.y - 1 };
        case 'down':
          return { x: head.x, y: head.y + 1 };
        default: 
          throw new Error("Invalid direction");
      }
    }
  }

  useEffect(() => {
    start();
  }, [count]);

  function reStart() {
    g.current = 0;
    direction.current = 'right';
    gameState.current = 'running';
    Food.hase = true;
    snack.current = [
      new Node(3, 0),
      new Node(2, 0),
      new Node(1, 0),
      new Node(0, 0),
    ]
  }

  function start() {
    requestAnimationFrame(gameLoop);
    document.addEventListener('keydown', (e) => {
      if(gameState.current === 'paused') {
        return;
      }
      if(e.key === 'ArrowLeft') {
        direction.current = 'left';
      } else if(e.key === 'ArrowRight') {
        direction.current = 'right';
      } else if(e.key === 'ArrowUp') {
        direction.current = 'up';
      } else if(e.key === 'ArrowDown') {
        direction.current = 'down';
      }

      if(e.key === 'a') {
        direction.current = 'left';
      } else if(e.key === 'd') {
        direction.current = 'right';
      } else if(e.key === 'w') {
        direction.current = 'up';
      } else if(e.key === 's') {
        direction.current = 'down';
      }
    })
  }

  function gameLoop(time: number) {
    if(gameState.current === 'running') {
      if(time - g.current > 200) {
        if(Food.hase) {
          food = createFood();
          console.log("create food");
          Food.hase = false;
        }
        snackMove();
        draw();
        g.current = time;
      }
    }
    requestAnimationFrame(gameLoop);
  }

  function draw() {
    // 绘制代码
    const ctx = canvasRef.current?.getContext('2d');
    if(!ctx) {
      return;
    }
    ctx.clearRect(0, 0, 600, 600);
    // 绘制背景
    ctx.strokeStyle = '#ccc';
    for(let i = 0; i < 600 / SIZE; i++) {
      for(let j = 0; j < 600 / SIZE; j++) {
        ctx.strokeRect(i * SIZE, j * SIZE, SIZE, SIZE);
      }
    }

    // 绘制蛇    
    for(let i = 0; i < snack.current.length; i++) {
      ctx.fillStyle = i === 0 ? '#333' : '#666';
      ctx.fillRect(snack.current[i].x * SIZE, snack.current[i].y * SIZE, SIZE, SIZE);
    }
    // 绘制食物
    if(food) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x * SIZE, food.y * SIZE, SIZE, SIZE);
    }
  }

  return (
    <>
      <h1>贪吃蛇</h1>
      <h2>得分：{count}</h2>
      <div>
        <button onClick={() => gameState.current = 'paused'}>暂停</button>
        <button onClick={() => gameState.current = 'running'}>继续</button>
        <button onClick={() => reStart()}>重来</button>
      </div>
      <canvas ref={canvasRef} width={600} height={600}></canvas>
    </>
  )
}

export default Snakes