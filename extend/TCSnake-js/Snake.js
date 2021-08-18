//所有关于蛇的代码都写在这个js文件中
(function (window) {
  //随机产生一个十六进制的颜色的函数.
  function getColorForRandom() {
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];  //下标0-15
    var str = "#";
    //循环产生 6个 0-15的数.
    for (var i = 0; i < 6; i++) {
      var num = Math.floor(Math.random() * 16);
      //根据这个随机数,在arr数组中去取值.
      str += arr[num];
    }
    return str;   //"#98de00"
  }

  //写蛇
  //声明一个数组list用来保存蛇.
  var list = [];

  //1.分析蛇也是有宽/高/背景色/移动的方向/定位xy坐标,蛇也是对象.
  function Snake(width, height, direction) {
    this.width = width || 20;
    this.height = height || 20;
    this.direction = direction || 'right';
    //这个body就是描述蛇的每一节的.
    this.body = [
      { x: 3, y: 1, bgColor: 'red' },
      { x: 2, y: 1, bgColor: '#fff' },
      { x: 1, y: 1, bgColor: '#0094ff' }
    ];
  }


  //2.把创建出来的蛇对象显示在map地图上.
  Snake.prototype.render = function (map) {
    //渲染新蛇的时候删除老蛇(调用remove方法)
    remove(map);

    //2.1 遍历蛇一节一节的显示.
    for (var i = 0; i < this.body.length; i++) {
      //2.2 创建div
      var div1 = document.createElement('div');
      //2.3 让这个div拥有这个蛇节的每一个显示信息
      div1.style.position = 'absolute';
      div1.style.top = this.body[i].y * this.height + 'px';
      div1.style.left = this.body[i].x * this.width + 'px';
      div1.style.width = this.width + 'px';
      div1.style.height = this.height + 'px';
      div1.style.backgroundColor = this.body[i].bgColor;
      //2.4 把div1添加到map中.
      map.appendChild(div1);

      //把渲染蛇用的div存进list数组中.
      list.push(div1);
    }
  }


  //4.删除老蛇的方法.
  function remove(map) {
    //从map中移除老蛇div.
    for (var i = 0; i < list.length; i++) {
      map.removeChild(list[i]);
    }
    //list数组清空.
    list.length = 0; // list = [];
  }


  //3.让蛇移动的方法写在蛇的原型中.
  Snake.prototype.move = function (food, map) {
    //除了蛇头之外的蛇身体的坐标改变
    for (var i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }

    //蛇头的坐标改变
    switch (this.direction) {
      case 'right':
        this.body[0].x++;
        break;
      case 'left':
        this.body[0].x--;
        break;
      case 'top':
        this.body[0].y--;
        break;
      case 'bottom':
        this.body[0].y++;
        break;
    }

    //判断蛇是否吃到了食物.
    //思路:蛇头的坐标和食物的坐标重合.
    var snakeHeadX = this.body[0].x * this.width; //蛇头的x坐标.
    var snakeHeadY = this.body[0].y * this.height; //蛇头的y坐标
    var foodX = food.x;//食物的x坐标
    var foodY = food.y;//食物的y坐标.
    //先拿到蛇尾巴(方便取他的xy)
    var lastSnakeUnit = this.body[this.body.length - 1];
    //判断
    if (snakeHeadX == foodX && snakeHeadY == foodY) {
      //吃到了食物就要长身体.
      this.body.push({
        x: lastSnakeUnit.x,
        y: lastSnakeUnit.y,
        bgColor: getColorForRandom()
      });
      //吃了食物要产生一个新的食物.
      food.render(map);
    }


  }



  //3.把Snake这个构造函数给暴露出去
  window.Snake = Snake;

}(window));
