//所有关于游戏逻辑的代码都写在这个js文件中.
(function (window) {
  //声明一个变量that,一开始赋值null
  var that = null;

  //1.创建游戏控制器对象的构造函数.
  function Game(map) {
    //游戏控制器对象,里面有食物对象,食物对象是调用食物的构造函数创建出来的.
    this.food = new Food();
    //游戏控制器对象,里面有蛇对象,蛇对象是调用蛇的构造函数创建出来的.
    this.snake = new Snake();
    //游戏控制对象,里面有地图,地图是传进来的.
    this.map = map;

    //给that赋值.
    that = this;
  }

  //2.游戏开始的方法.
  Game.prototype.start = function () {
    //2.1 显示食物对象.
    this.food.render(this.map);
    //2.2 显示蛇对象
    this.snake.render(this.map);
    //2.3 让蛇动一下,调用蛇对象的move方法改坐标,调用蛇的render方法重新渲染.
    snakeAutoMove();

    //2.4 调用绑定按键方法.
    bindKey();
  }


  //3.写一个方法让蛇不停的动起来.本质就是用一个计时器不停的调用蛇的move和render方法.
  function snakeAutoMove() {
    var timerId = setInterval(function () {
      //console.log(this);//window对象

      //需求:把此时这个this变成游戏控制器对象
      this.snake.move(this.food, this.map);

      //判断蛇移动后有没有出界.
      //思路:蛇头的坐标小于0,或者大于宽高就出界.
      var snakeHeadX = this.snake.body[0].x * this.snake.width;//蛇头x坐标
      var snakeHeadY = this.snake.body[0].y * this.snake.height;//蛇头y坐标
      if (snakeHeadX < 0 || snakeHeadY < 0 || snakeHeadX >= this.map.offsetWidth || snakeHeadY >= this.map.offsetHeight) {
        alert('Game Over!');
        clearInterval(timerId);
        return;//判断蛇出界了,那就提前结束这个方法,就不要让他往下执行这个渲染.
      }
      this.snake.render(this.map);
    }.bind(that), 400);
  }

  //4.绑定键盘按键方法,让蛇根据键盘按键来移动.
  function bindKey() {
    document.onkeydown = function (e) {
      e = e || window.event;
      //console.log(e.keyCode);//左37  上38 右39  下40
      switch (e.keyCode) {
        case 37:
          if (this.snake.direction != 'right') {
            this.snake.direction = 'left';
          }
          break;
        case 38:
          if (this.snake.direction != 'bottom') {
            this.snake.direction = 'top';
          }
          break;
        case 39:
          if (this.snake.direction != 'left') {
            this.snake.direction = 'right';
          }
          break;
        case 40:
          if (this.snake.direction != 'top') {
            this.snake.direction = 'bottom';
          }
          break;
      }
    }.bind(that);
  }


  //3.把Game构造函数给暴露出去.
  window.Game = Game;

}(window));
