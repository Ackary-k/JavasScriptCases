// 生成页码条方法   ( 页码点击回调方法 , 页码条容器 ，当前页码  ，  页容量  ，  页码组容量,   总行数 ，      简单模式   ，          是否中文， 所有数据数组-所有页的数据数组，一般是页面练习时用)
function makePageBar({ pageFunc, pageContainer, pgIndex = 1, pgSize = 7, gpSize = 6, roCount = 100, simpleModel = false, isCn = true, allData = [] }) {

  //一、生成页码条代码--------------------------------------------------
  var langObj = isCn ? { next: '下一页', prev: '上一页', nextG: '下一组', prevG: '上一组' } : { next: 'Next', prev: 'Prev', nextG: 'NextGroup', prevG: 'PrevGroup' };
  //计算总页数（总行数 / 页容量）
  var pgCount = Math.ceil(roCount / pgSize);
  var groupFirstPageIndex = 0;  //当前页码组的第一个页码
  var groupCount = 0; //页码组个数
  if (typeof pageContainer == "string")
    pageContainer = document.querySelector('#' + pageContainer);

  pageContainer.innerHTML = "";
  //获得当前页码组 的 第一个页码 ，为了 在点击 NextGroup 时
  //这样：1.加上 3 就可以获得 【下一个页码组】的 第一页
  //            2.减去1 就可以获得 【上一个页码组】的最后一页
  groupFirstPageIndex = (Math.floor(((pgIndex - 1) / gpSize)) * gpSize) + 1;
  //获得页码组总个数
  groupCount = Math.ceil(pgCount / gpSize);
  //生成统计数据
  if (!simpleModel)
    pageContainer.innerHTML = "页码：" + pgIndex + "/" + pgCount + " │ 共" + roCount + "条";

  //生成 上一个页码组 按钮
  var pagePrevGroup = document.createElement("a");
  pagePrevGroup.href = "javascript:void(0)";
  if (groupFirstPageIndex > 1) {
    pagePrevGroup.onclick = function () {
      pgIndex = groupFirstPageIndex - 1;
      pageFunc(groupFirstPageIndex - 1);
    };
  }
  pagePrevGroup.innerHTML = langObj.prevG;
  pageContainer.appendChild(pagePrevGroup);

  //生成 上一页 按钮
  var pagePrev = document.createElement("a");
  pagePrev.href = "javascript:void(0)";
  pagePrev.onclick = function () {
    if (pgIndex > 1) {
      pgIndex--;
      pageFunc(pgIndex);
    } else {
      alert("已经是第一页咯~~！");
    }
  };
  pagePrev.innerHTML = langObj.prev;
  pageContainer.appendChild(pagePrev);

  //按照 页码组容量 和当前页码组 来生成 页码
  var tempI = 0;
  tempI = groupFirstPageIndex;//此时获得的是当前页码组的第一页
  do {
    //页码按钮
    var pageA = document.createElement("a");
    pageA.href = "javascript:void(0)";
    if (tempI == pgIndex) {
      pageA.className = 'active';
      pageA.innerHTML = tempI;
    } else {//否则 生成超链接页码按钮
      pageA.setAttribute("pi", tempI);
      pageA.onclick = function () { pageFunc(this.getAttribute("pi")) };
      pageA.innerHTML = tempI;
    }
    pageContainer.appendChild(pageA);
    tempI++;
  } while (tempI < groupFirstPageIndex + gpSize && tempI <= pgCount);//1.不能超过当前页码组最后一个下标 2.不能超过总页数

  //生成下一页
  var pageNext = document.createElement("a");
  pageNext.href = "javascript:void(0)";
  pageNext.onclick = function () {
    //判断 当前页码 是否小于 总页数
    if (pgIndex < pgCount) {
      pgIndex++;
      pageFunc(pgIndex);
    } else {
      alert("已经是最后一页咯~~！");
    }
  };
  pageNext.innerHTML = langObj.next;
  pageContainer.appendChild(pageNext);

  //生成 NextGroup
  var pageNextGroup = document.createElement("a");
  pageNextGroup.href = "javascript:void(0)";
  if (groupFirstPageIndex + gpSize <= pgCount) {
    pageNextGroup.onclick = function () {
      pgIndex = groupFirstPageIndex + gpSize;
      pageFunc(groupFirstPageIndex + gpSize);
    };
  }
  pageNextGroup.innerHTML = langObj.nextG;
  pageContainer.appendChild(pageNextGroup);

  if (!simpleModel) {
    var sel = document.createElement("select");
    sel.onchange = function () {
      var pi = this.value;
      pageFunc(pi);
    };
    for (var i = 0; i < pgCount; i++) {
      var opt = new Option("第" + (i + 1) + "页", i + 1);
      if (i == (pgIndex - 1))
        opt.selected = true;
      sel.options.add(opt);
    }

    pageContainer.appendChild(sel);
  }


  //二、从 总数据数组中 返回 当前页数据数组--------------------------------
  if (allData && allData instanceof Array && allData.length > 0) {
    //2.加载数据：根据页码 和 页容量 生成 只包含当前页数据的 新数组
    //a.计算 开始 下标 和 结束下标
    var beginIndex = (pgIndex - 1) * pgSize; // 第1页： (1-1) * 4 = 0
    var endIndex = (pgIndex * pgSize) - 1;   // 第1页： (1*4) - 1 = 3
    //b.如果 结束下标 小于 数组长度，则 正常
    //              >=  数组长度，则 返回数组最后一个元素的下标
    endIndex = endIndex < allData.length ? endIndex : allData.length - 1;
    // 后台输出 跟踪：
    console.log('总行数：', allData.length, '页容量:', pgSize, '页码:', pgIndex, '开始下标:', beginIndex, '结束下标:', endIndex);
    //b.根据起始下标 获取 新数组
    var pagedData = [];
    for (var i = beginIndex; i <= endIndex; i++) {
      pagedData.push(allData[i]);
    }
    return pagedData;
  }
};