window.addEventListener('load', function () {
    let codeBox = document.querySelector(".code");
    // let bottomDiv = document.querySelector("#Copyright");
    let fileInput = document.querySelector("#fileInput");
    let num = document.querySelector("#num");
    let codeSum = 0; // 初始化js代码总数为0

    // input按钮发生变动时触发解析动作
    fileInput.addEventListener("change", selectedFileChanged);

    function selectedFileChanged() {
        console.log(fileInput.files); //可以显示文件的属性信息哦
        // 遍历上传的多个文件
        let count = 0;
        for (let i = 0; i < fileInput.files.length; i++) {
            const reader = new FileReader(); // 定义个FileReader对象
            console.log(reader);
            reader.readAsText(this.files[i]); //使用FileReader里的方法确定当前读取的文件，及返回文本数据的类型
            reader.onload = function () {
                // 创建每个文件中js代码的展示区
                let scriptNum = this.result.split('<script>'); //获取script标签之间的内容
                for (let j = 1; j < scriptNum.length; j++) {
                    let temp = scriptNum[j].split('</script>')[0]; //获取script与/script之间的script代码字符串
                    let code = temp.split(' ').join('').split('\r\n'); //获取回车符之间的代码
                    for (let k = 0; k < temp.length; k++) {
                        if (code[k]) { //如果回车符之间有代码就计数
                            count++;
                        }
                    }
                }
                //所有script代码计数完成输出结果
                num.innerHTML = `今天一共敲了${count}行js代码哦`;
            }
        };
    }
})