// 表单校验 组件
// 0.添加 预定义 规则
// 1.找出 需要校验的 表单 和 表单元素
// 2.为 表单元素 添加 失去焦点事件
// 3.在失去焦点事件，绑定 事件处理函数：
//   3.1 获取 表单元素上 指定的 校验规则名字
//   3.2 为表单 元素 后面 追加 提示消息用的 span
//   3.3 使用 校验规则 校验 表单元素的值
//   3.4 如果 通过，则显示 成功消息
//   3.5 如果 失败，则显示 失败消息
// 4.表单提交时，也需要做最后的 校验，校验通过，才可以 提交，否则，阻止表单提交

class JZValid15 {
  // 构造函数
  constructor() {
    // 将 new的对象 保存到 类的静态属性中，方便 其他函数调用
    JZValid15.instace = this;
    // 0.添加 预定义 规则
    this.rules = {
      username: [/^\w{6,15}$/, '用户名格式错误哦~'],
      tel: [/^1[3|4|5|7|8]\d{9}$/, '电话号码格式错误哦~'],
      telMsg: [/^\d{6}$/, '短信验证码错哦~'],
      qq: [/^[1-9]\d{4,}$/, 'qq格式错误哦~'],
      nickName: [/^[\u4e00-\u9fa5]{2,8}$/, '必须是2-8个汉字哦~'],
      pwd: [/^[a-zA-Z0-9_-]{6,16}$/, '密码格式错误哦~'],
      email: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, '邮箱格式错误哦~']
    }

    // 1.找出 需要校验的 表单 和 表单元素
    this.formDom = document.querySelector('form[jzvalid="true"]')
    this.formEleList = this.formDom.querySelectorAll('input[jz-verify]')

    // 2.为 表单元素 添加 失去焦点事件
    this.formEleList.forEach(ele => {
      ele.addEventListener('blur', this.eleBlur)
    })

    console.log(this)

    this.appendStyle()
    this.appendImg()
  }

  // 【类的 静态属性 instace， 当前 new 的实例对象】
  static instace;

  // 3.失去焦点 事件处理函数 ----------------------------------------------------------
  eleBlur() {
    //3.1 获取 表单元素上 指定的 校验规则名字
    let ruleName = this.getAttribute('jz-verify')
    //3.2 为表单 元素 后面 追加 提示消息用的 span
    //    如果 当前表单元素 后面 没有 消息span，就创建一个 并 添加到后面
    if (!this.nextElementSibling || !this.nextElementSibling.getAttribute('jzspan')) {
      // a.创建span
      let spanDom = document.createElement('span')
      spanDom.setAttribute('jzspan', true)
      // b.将 span 添加到 当前 文本框 后面的 兄弟元素之前
      this.parentNode.insertBefore(spanDom, this.nextElementSibling)
    }

    //3.3 使用 校验规则 校验 表单元素的值
    //a.根据 校验规则名字，获取校验 数组
    let arrRule = JZValid15.instace.rules[ruleName]
    //3.4 如果 通过，则显示 成功消息
    if (arrRule[0].test(this.value)) {
      this.nextElementSibling.className = 'success'
      this.nextElementSibling.innerHTML = `<img src="${JZValid15.instace.imgData.success}"> 校验成功~~！`
    } else {//3.5 如果 失败，则显示 失败消息
      this.nextElementSibling.className = 'error'
      this.nextElementSibling.innerHTML = `<img src="${JZValid15.instace.imgData.error}"> ${arrRule[1]}`
    }
  }

  // 4.为 页面添加 消息 样式表类名
  appendStyle() {
    const styleTag = document.createElement('style')
    styleTag.innerHTML = `
      .error {
          color: #df3033;
          margin-left: 10px;
      }
      .success {
            color: #40b83f;
            margin-left: 10px;
      }
      span[jzspan] img{vertical-align: middle;}
      `
    document.head.appendChild(styleTag)
  }


  // 5.添加 成功失败 图片 base64数据
  appendImg() {
    this.imgData = {
      success: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MDFBOERGMDcxOTIwNjgxMTgyMkE5RTI4MTI2OTA1RDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA1QUNENTM1NzZCMTFFODk1Q0FCQ0QyRkZDMjQxMzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA1QUNENTI1NzZCMTFFODk1Q0FCQ0QyRkZDMjQxMzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjliMTgzNGQtZTcxNy0yNTQzLTkyMDItNjA3NGJmYzcwNzM3IiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkI3NTIxOEFBQkM0M0U1MTFCN0RDOUJGN0NCOTU3OERCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+E8eNMQAAAeVJREFUeNpi/P//PwMS+PPv9+HXhw+9OnT546XXP1+zMrKKc4ir8arbidnbitqwMLEiK2ZE1gzUM+325EffHjFgA3JcclmqOUBT0DX/+/9v5p2Zix8sYCAEYhUS0lXSmRiZgGwmiBCROoEAqAyoGMIGaT7w6gCROuH6gVpAmoEhNPFmPzF6dAX0eg0ncLPwANkTbvYBNTLtf7Xv5Y8XxOjsM5xgKWLZpNsC5L768XLfy/1Mh14eJlInNwv31z9fF96fD4uaA0zXPl+FKwI6CegwoFJcOovPF176cBEifv3zdaa3P9/A1TXrtgAd1oekX09AH6tOIHjz8w2zaoLK73+/IPznP547ijsBlTqJO1/8cEGcQ6LXsB+rTiBgZmRmjDga9vDrA7gQ0Cq4BrBHsOsEAklOKSYVblVkIaAioFKgBqA2PDqBQJNXk8lO3BZNFKj08odLEDaQgVUnENiJOTD+/vsr9GgIWlQDg70ZHJ+1l2u+/vmCqVOMQ3y19VpQxtj/cn/1pQoGUkCrXoejuCMobQOpWIU44nUCFQO1IHJVukpmmGw4MTpDZcOBirEUBgdfHZx+ewqewiBDNdtBzAF7SQIphoBZ5eDLgzc+33j94xVQRJRDTINXw17c3lHMCa0YAggwANH4/W88RfVgAAAAAElFTkSuQmCC',
      error: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MDFBOERGMDcxOTIwNjgxMTgyMkE5RTI4MTI2OTA1RDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTM0MjVENDU1NzZCMTFFODk5RkZDOEVERUY2M0JBNTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTM0MjVENDQ1NzZCMTFFODk5RkZDOEVERUY2M0JBNTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjliMTgzNGQtZTcxNy0yNTQzLTkyMDItNjA3NGJmYzcwNzM3IiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkI3NTIxOEFBQkM0M0U1MTFCN0RDOUJGN0NCOTU3OERCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZNsK7wAAAd9JREFUeNpi/P//PwMS+P/79/f9+7/v2//z4sW/r18ysrIyi0uwaWhyOjtxOjgAuciKGZE1f9+370Nf/+9HDxiwAVY5BYHCAk5nZwzN//59nDTp47y5DIQAf1Iyf14eAxMTkM0EESJSJ0jlvLlAxRA2SPO3PXuI1AnXD9QC0gwMoQ9dnXAJJh5usanT2PUNkVUDuUBBoBRc5H1nJ1Aj0/fdu/+8eAEXFenq4bC1FZ2O0A9kALlAQZHObriyvy9ffNu1iwkYKyhOmjX735cvTDw8IP0GRhCdQC5Q8OPsOcgqgRoZn7p7/Hn2BMWRBkai06ZCNIA9AmK8zsr+eeEcsjIWKRmmv29fo4UHUBFQKcR+XDpBLn/ziomRlYWBXMDELCqGJoTsbKj/p00FCqIpYxYRY2JTVcelE+hauPsx9bNpazNxOjmipL60VGR/IvsfKIWsEqiR8d+vX8+9veBRDUwJwKgGRhhyCAHtBOp8U1by78tXqJvFJaS2bgVljG+7d78pLiIpqER6+7hcXUFpG0jxJyYTrxOoGKgFkav48/P4oqKJ0ckbGQ1UjK0w2Lv3Q/8EPIUBf0E+l4sL9pIEWgzt3v1t775f1679ffUcFDZikmxaWlzAYsjVFa0YAggwAMDK+21Z7eJkAAAAAElFTkSuQmCC'
    }
  }

}