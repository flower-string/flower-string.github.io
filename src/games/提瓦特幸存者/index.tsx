import { useRef } from "react";

function Teyvat() {
  // 这里写游戏逻辑
  const canvas = useRef<HTMLCanvasElement>(null);
  const gameState = useRef<string>('running');

  class Enemy {
    x: number;
    y: number;
    r: number;
    speed: number;

    constructor(x: number, y: number, r: number, speed: number) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.speed = speed;
    }
  }

  class Buttle {
    x: number;
    y: number;
    r: number;
    speed: number;
    rotation: number;

    constructor(x: number, y: number, r: number, speed: number, rotation: number) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.speed = speed;
      this.rotation = rotation;
    }
  }

  let t = 0;
  let deltaEnemy = 0;

  const player = {
    x: 800 / 2,
    y: 600 / 2,
    r: 25,
    speed: 5,
    rotation: 0,
  };
  const keyState = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  }

  const enemys: Array<Enemy> = [];
  const buttles: Array<Buttle> = [];
  function start() {
    requestAnimationFrame(loop);
    // 三个小球围绕player旋转, 三个小球相隔120度
    for(let i = 0; i < 3; i++) {
      const x = player.x + Math.cos(i * Math.PI * 2 / 3) * 50;
      const y = player.y + Math.sin(i * Math.PI * 2 / 3) * 50;
      buttles.push(
        new Buttle(x, y, 25, 5, 0)
      )
    }
    console.log(buttles);
    

    window.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowUp') {
        keyState.ArrowUp = true;
      } else if(e.key === 'ArrowDown') {
        keyState.ArrowDown = true;
      } else if(e.key === 'ArrowLeft') {
        keyState.ArrowLeft = true;
      } else if(e.key === 'ArrowRight') {
        keyState.ArrowRight = true;
      }
    })

    window.addEventListener('keyup', (e) => {
      if(e.key === 'ArrowUp') {
        keyState.ArrowUp = false;
      } else if(e.key === 'ArrowDown') {
        keyState.ArrowDown = false;
      } else if(e.key === 'ArrowLeft') {
        keyState.ArrowLeft = false;
      } else if(e.key === 'ArrowRight') {
        keyState.ArrowRight = false;
      }
    })
  }

  function reStart() {
    location.reload();
  }

  function loop(time: number) {
    if(gameState.current == 'pausing') {
      return;
    }
    deltaEnemy += time - t;
    t = time;
    // 生成新敌人
    if(deltaEnemy > 3000) {
      enemys.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: 10,
        speed: 10,
      });
      deltaEnemy = 0;
    }
    // 小球旋转
    for(let i = 0; i < buttles.length; i++) {
      const buttle = buttles[i];
      buttle.rotation += 0.05;
      // 三个小球围绕player旋转, 三个小球相隔120度
      const x = player.x + Math.cos(i * Math.PI * 2 / 3 + buttle.rotation) * 50;
      const y = player.y + Math.sin(i * Math.PI * 2 / 3 + buttle.rotation) * 50;
      buttle.x = x;
      buttle.y = y;
    }
    // 敌人移动，敌人会朝player的方向移动
    for(let i = 0; i < enemys.length; i++) {
      const enemy = enemys[i];
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const vx = dx / distance * enemy.speed;
      const vy = dy / distance * enemy.speed;
      enemy.x += vx;
      enemy.y += vy;
    }

    // 碰撞检测
    // 敌人和子弹的碰撞检测
    for(let i = 0; i < enemys.length; i++) {
      const enemy = enemys[i];
      for(let j = 0; j < buttles.length; j++) {
        const buttle = buttles[j];
        if(checkCollision(enemy, buttle)) {
          enemys.splice(i, 1);
          continue;
        }
      }
    }
    // 敌人和玩家的碰撞检测
    for(let i = 0; i < enemys.length; i++) {
      const enemy = enemys[i];
      if(checkCollision(enemy, player)) {
        enemys.splice(i, 1);
        gameState.current = 'pausing';
        break;
      }
    }
    if(keyState.ArrowUp) {
      player.y -= player.speed;
    } else if(keyState.ArrowDown) {
      player.y += player.speed;
    } else if(keyState.ArrowLeft) {
      player.x -= player.speed;
    } else if(keyState.ArrowRight) {
      player.x += player.speed;
    }

    draw();
    requestAnimationFrame(loop);
  }

  function draw() {
    const ctx = canvas.current?.getContext('2d');
    if(!ctx) {
      return;
    };
    ctx.clearRect(0, 0, 800, 600);
    // 绘制背景
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, 800, 600);

    // 绘制玩家
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fill();

    // 绘制子弹
    for(let i = 0; i < buttles.length; i++) {
      const buttle = buttles[i];
      ctx.beginPath();
      ctx.fillStyle = '#2df';
      ctx.arc(buttle.x, buttle.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    

    // 绘制敌人
    
    for(let i = 0; i < enemys.length; i++) {
      const enemy = enemys[i];
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  start();

  // 球的碰撞检测
  function checkCollision(ball1: {x: number, y: number, r: number}, ball2: {x: number, y: number, r: number}) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if(distance < ball1.r + ball2.r) {
      // 碰撞发生
      return true;
    }
    
    return false;
  }

  return (
    <>
      <h1>提瓦特幸存者</h1>
      <button onClick={() => reStart()}>重新开始</button>
      <canvas ref={canvas} width={800} height={600}></canvas>
    </>
  )
}

export default Teyvat