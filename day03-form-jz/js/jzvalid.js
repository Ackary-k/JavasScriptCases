// 表单校验类
class JZFormValid {
  constructor() {
    JZFormValid.that = this
    // 准备 两张base64图片
    this.initBase64Img()
    // 校验全部通过标志
    this.isAllOk = true
    // 预定义 校验规则
    this.rules = {
      tel: [/^1[3|4|5|7|8]\d{9}$/, '电话号码格式错误哦~'],
      telMsg: [/^\d{6}$/, '短信验证码错哦~'],
      qq: [/^[1-9]\d{4,}$/, 'qq格式错误哦~'],
      nickName: [/^[\u4e00-\u9fa5]{2,8}$/, '必须是2-8个汉字哦~'],
      pwd: [/^[a-zA-Z0-9_-]{6,16}$/, '密码格式错误哦~'],
      email: [/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, '邮箱格式错误哦~']
    }
    // 用户自定义 校验规则
    this.rulesUser = {}
    // 为页面 添加 style 标签
    this.initStyle()
    // 查找校验的表单元素，并为表单提交事件绑定函数
    this.setValidForm()
  }
  // 保存了 new JZFormValid()
  static that;

  addUserRule(ruleName, validRule, errMsg) {
    // 将 用户自定义校验规则 添加到 rulesUser 对象中
    this.rulesUser[ruleName] = [validRule, errMsg]
  }

  //根据自定义属性 查找所有需要 校验的表单元素,并绑定提交事件处理函数
  setValidForm() {
    // 查找 添加了 jzvalid="true" 的表单dom
    this.formObj = document.querySelector('form[jzvalid=true]')
    // 查找 表单中 需要校验的 表单元素e
    this.formEles = this.formObj.querySelectorAll('input[jz-verify]')
    // 为 所有 需要校验的 表单元素 绑定 onblur事件
    for (let e of this.formEles) {
      // 为 每个 表单元素 添加 onblur 事件
      e.addEventListener('blur', this.validEleOnBlur)
      // 默认将 每个 表单元素 标记 为 校验失败
      e.setAttribute('isOk', false)
    }
    // 为 表单 注册 提交事件 处理函数
    this.formObj.addEventListener('submit', this.validateForm)
  }

  // 校验当前失去焦点的表单元素(文本框)的值是否符合规则
  validEleOnBlur() {
    //a.获取 当前表单元素的 jz-verify 属性值，获取 规则名字
    let ruleName = this.getAttribute('jz-verify')
    //b.根据规则名，获取 规则数组[正则表达式，错误消息]
    let ruleArr = JZFormValid.that.rules[ruleName] // 通过 对象中括号访问法 获取规则值
    // 如果 规则不存在，则去自定义规则中找
    if (!ruleArr) ruleArr = JZFormValid.that.rulesUser[ruleName] // 尝试获取 用户定义的规则或函数

    //c.创建消息span
    let msgSpan = document.createElement('span')
    msgSpan.setAttribute('jzspan', 'true')
    //如果表单元素后面不存在span,则添加一个消息span
    if (!this.nextElementSibling) this.parentNode.appendChild(msgSpan)
    else if (!this.nextElementSibling.getAttribute('jzspan')) {
      this.parentNode.insertBefore(msgSpan, this.nextElementSibling)
    }

    //d.如果校验失败，则需要在当前元素后面 追加一个 span显示错误消息
    let res = ruleArr[0] instanceof RegExp ? ruleArr[0].test(this.value) : ruleArr[0](this.value)
    if (!res) {
      // 标记 校验失败
      this.setAttribute('isOk', false)
      this.nextElementSibling.className = 'error'
      // 将错误消息 显示到 消息span中
      this.nextElementSibling.innerHTML = `<img src="${JZFormValid.that.imgData.errImg}"> ${ruleArr[1]}`
    } else {
      // 标记 校验成功
      this.setAttribute('isOk', true)
      this.nextElementSibling.className = 'success'
      // 将错误消息 显示到 消息span中
      this.nextElementSibling.innerHTML = `<img src="${JZFormValid.that.imgData.successImg}"> 校验通过哦~~`
    }
  }

  //校验表单中的 各种元素（文本框、密码框....）
  validateForm(e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    // 提出假设：假设所有表单元素 都通过校验
    let isAllOk = true
    // 校验假设：
    // 遍历 表单元素 数组，判断 表单元素.isOk 是否有为false，如果有，则不提交表单
    for (let ele of JZFormValid.that.formEles) {
      if (ele.getAttribute('isOk') === 'false') {
        // 如果有表单元素 为通过校验，则打破假设，将 假设变量 设置为 false
        isAllOk = false
        break
      }
    }
    // 根据 假设的校验结果 做不同的业务处理
    if (isAllOk) this.submit()
    else alert('表单校验尚未全部通过，请按照提示重新填写！')
  }

  // 为页面 添加 style 标签
  initStyle() {
    let style = document.createElement('style')
    style.innerHTML = `.error {
                          color: #df3033;
                          margin-left: 10px;
                      }
                      .success {
                        color: #40b83f;
                        margin-left: 10px;
                      }`
    document.body.appendChild(style)
  }

  // 准备 两张base64图片
  initBase64Img() {
    // 准备了 成功 和失败的 两张图片
    this.imgData = {
      errImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MDFBOERGMDcxOTIwNjgxMTgyMkE5RTI4MTI2OTA1RDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTM0MjVENDU1NzZCMTFFODk5RkZDOEVERUY2M0JBNTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTM0MjVENDQ1NzZCMTFFODk5RkZDOEVERUY2M0JBNTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjliMTgzNGQtZTcxNy0yNTQzLTkyMDItNjA3NGJmYzcwNzM3IiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkI3NTIxOEFBQkM0M0U1MTFCN0RDOUJGN0NCOTU3OERCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZNsK7wAAAd9JREFUeNpi/P//PwMS+P/79/f9+7/v2//z4sW/r18ysrIyi0uwaWhyOjtxOjgAuciKGZE1f9+370Nf/+9HDxiwAVY5BYHCAk5nZwzN//59nDTp47y5DIQAf1Iyf14eAxMTkM0EESJSJ0jlvLlAxRA2SPO3PXuI1AnXD9QC0gwMoQ9dnXAJJh5usanT2PUNkVUDuUBBoBRc5H1nJ1Aj0/fdu/+8eAEXFenq4bC1FZ2O0A9kALlAQZHObriyvy9ffNu1iwkYKyhOmjX735cvTDw8IP0GRhCdQC5Q8OPsOcgqgRoZn7p7/Hn2BMWRBkai06ZCNIA9AmK8zsr+eeEcsjIWKRmmv29fo4UHUBFQKcR+XDpBLn/ziomRlYWBXMDELCqGJoTsbKj/p00FCqIpYxYRY2JTVcelE+hauPsx9bNpazNxOjmipL60VGR/IvsfKIWsEqiR8d+vX8+9veBRDUwJwKgGRhhyCAHtBOp8U1by78tXqJvFJaS2bgVljG+7d78pLiIpqER6+7hcXUFpG0jxJyYTrxOoGKgFkav48/P4oqKJ0ckbGQ1UjK0w2Lv3Q/8EPIUBf0E+l4sL9pIEWgzt3v1t775f1679ffUcFDZikmxaWlzAYsjVFa0YAggwAMDK+21Z7eJkAAAAAElFTkSuQmCC',
      successImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MDFBOERGMDcxOTIwNjgxMTgyMkE5RTI4MTI2OTA1RDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA1QUNENTM1NzZCMTFFODk1Q0FCQ0QyRkZDMjQxMzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA1QUNENTI1NzZCMTFFODk1Q0FCQ0QyRkZDMjQxMzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjliMTgzNGQtZTcxNy0yNTQzLTkyMDItNjA3NGJmYzcwNzM3IiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkI3NTIxOEFBQkM0M0U1MTFCN0RDOUJGN0NCOTU3OERCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+E8eNMQAAAeVJREFUeNpi/P//PwMS+PPv9+HXhw+9OnT546XXP1+zMrKKc4ir8arbidnbitqwMLEiK2ZE1gzUM+325EffHjFgA3JcclmqOUBT0DX/+/9v5p2Zix8sYCAEYhUS0lXSmRiZgGwmiBCROoEAqAyoGMIGaT7w6gCROuH6gVpAmoEhNPFmPzF6dAX0eg0ncLPwANkTbvYBNTLtf7Xv5Y8XxOjsM5xgKWLZpNsC5L768XLfy/1Mh14eJlInNwv31z9fF96fD4uaA0zXPl+FKwI6CegwoFJcOovPF176cBEifv3zdaa3P9/A1TXrtgAd1oekX09AH6tOIHjz8w2zaoLK73+/IPznP547ijsBlTqJO1/8cEGcQ6LXsB+rTiBgZmRmjDga9vDrA7gQ0Cq4BrBHsOsEAklOKSYVblVkIaAioFKgBqA2PDqBQJNXk8lO3BZNFKj08odLEDaQgVUnENiJOTD+/vsr9GgIWlQDg70ZHJ+1l2u+/vmCqVOMQ3y19VpQxtj/cn/1pQoGUkCrXoejuCMobQOpWIU44nUCFQO1IHJVukpmmGw4MTpDZcOBirEUBgdfHZx+ewqewiBDNdtBzAF7SQIphoBZ5eDLgzc+33j94xVQRJRDTINXw17c3lHMCa0YAggwANH4/W88RfVgAAAAAElFTkSuQmCC'
    }
  }
}
