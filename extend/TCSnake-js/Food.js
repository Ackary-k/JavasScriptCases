//所有关于食物的js代码都写在这个文件中.
(function (window) {
  //声明一个数组,用来保存食物
  var list = [];
  //1.经过分析,发现食物有宽/高/背景色/定位的xy坐标,所以食物是一个对象,那就有一个创建食物对象的构造函数.
  function Food(width, height, bgColor, x, y) {
    this.width = width || 20;
    this.height = height || 20;
    this.bgColor = bgColor || "#000";
    this.x = x || 0;
    this.y = y || 0;
  }

  //2.把食物对象显示在地图上的代码封装成一个函数, 请问这个函数写在哪儿? 写在原型中比较好.
  //a.如果有很多个食物对象,那他们都要显示在地图上,那这个显示的方法就是一个共有的方法,那就应该写在原型中.
  //b.写在原型中的方法,食物对象可以直接点出来调用.
  Food.prototype.render = function (map) {
    //渲染新食物之前删除老食物div.
    remove(map);

    //2.1 给食物对象随机产生xy坐标
    this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
    this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
    //2.2 创建一个div,让这个div拥有这个食物对象的所有显示信息.(把食物对象的xy宽高背景色都赋值给div的样式)
    var div1 = document.createElement('div');
    div1.style.position = 'absolute';
    div1.style.left = this.x + "px";
    div1.style.top = this.y + 'px';
    div1.style.width = this.width + "px";
    div1.style.height = this.height + 'px';
    div1.style.backgroundColor = this.bgColor;
    //2.3 把这个div添加到map地图中.
    map.appendChild(div1);

    //2.4 把渲染食物的这个div用list数组存起来
    list.push(div1);
  }

  //删除老食物div的方法.
  function remove(map) {
    for (var i = 0; i < list.length; i++) {
      map.removeChild(list[i]);
    }
    list = []; //清空list
  }

  //3.把Food这个构造函数给暴露出去.
  window.Food = Food;

}(window));
