/* eslint-disable no-multi-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
Object.defineProperty(exports, "__esModule", {
    value: true
});

const _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const quillRedefine = exports.quillRedefine = function quillRedefine(config) {
    // placeholder
    const placeholder = config.placeholder || 'please write here ...';

    // 主题
    const theme = config.theme || 'snow';
    // 工具栏的工具选项
    const defaultToolOptions = [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'direction': 'rtl' }], [{ 'size': ['small', false, 'large', 'huge'] }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean'], ['link', 'image', 'video']];
    const toolOptions = config.toolOptions || defaultToolOptions;

    // 图片上传参数设置
    const defaultUploadConfig = {
        action: '', // 必填参数 图片上传地址
        methods: 'POST', // 必填参数 图片上传方式
        // token: sessionStorage.token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        name: 'img', // 必填参数 文件的参数名
        // size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
        accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, audio/mp3' // 可选 可上传的图片格式
    };
    const uploadConfig = Object.assign(defaultUploadConfig, config.uploadConfig);
    // 用户自定义的重写handlers
    const moreHandlers = config.handlers || {};

    // 重写图片上传事件, 任何工具按钮的功能都可以重写，默认只重写图片上传事件
    // 合并用户自定义的事件
    const handlers = {
 ...moreHandlers,
image: function image() {
            const self = this;

            let fileInput = this.container.querySelector('input.ql-image[type=file]');
            if (fileInput === null) {
                fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                // 设置图片参数名
                if (uploadConfig.name) {
                    fileInput.setAttribute('name', uploadConfig.name);
                }
                // 可设置上传图片的格式
                fileInput.setAttribute('accept', uploadConfig.accept);
                fileInput.classList.add('ql-image');
                // 监听选择文件
                fileInput.addEventListener('change', () => {
                    // change事件
                    if (uploadConfig.change) {
                        uploadConfig.change(formData);
                    }
                    // 如果图片限制大小
                    if (uploadConfig.size && fileInput.files[0].size >= uploadConfig.size * 1024) {
                        fileInput.value = '';
                        return;
                    }
                    // 创建formData
                    var formData = new FormData();
                    formData.append(uploadConfig.name, fileInput.files[0]);
                    // 如果需要token且存在token
                    if (uploadConfig.token) {
                        formData.append('token', uploadConfig.token);
                    }
                    // 图片上传
                    const xhr = new XMLHttpRequest();
                    xhr.open(uploadConfig.methods, uploadConfig.action, true);
                    // 设置请求头
                    if (uploadConfig.header) {
                        uploadConfig.header(xhr, formData);
                    }
                    // 上传数据成功，会触发
                    xhr.onload = function (e) {
                        if (xhr.status === 200) {
                            const res = JSON.parse(xhr.responseText);
                            const url = uploadConfig.res(res);
                            console.log(res)
                            const length = self.quill.getSelection(true).index;
                            if (res.data.type === 'audio') {
                                self.quill.insertEmbed(length, 'audio', url)
                            } else {
                                self.quill.insertEmbed(length, 'image', url);
                            }
                            self.quill.setSelection(length + 1);
                            if (uploadConfig.success) {
                                uploadConfig.success();
                            }
                        }
                        fileInput.value = '';
                    };
                    // 开始上传数据
                    xhr.upload.onloadstart = function (e) {
                        fileInput.value = '';
                        // console.log('开始上传')
                        if (uploadConfig.start) {
                            uploadConfig.start();
                        }
                    };
                    // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
                    xhr.upload.onerror = function (e) {
                        if (uploadConfig.error) {
                            uploadConfig.error();
                        }
                    };
                    // 上传数据完成（成功或者失败）时会触发
                    xhr.upload.onloadend = function (e) {
                        // console.log('上传结束')
                        if (uploadConfig.end) {
                            uploadConfig.end();
                        }
                    };
                    xhr.send(formData);
                });
                this.container.appendChild(fileInput);
            }
            fileInput.click();
        }

        // 全部配置
    }; return {
        placeholder,
        theme, // 主题
        modules: {
            toolbar: {
                container: toolOptions, // 工具栏选项
                handlers // 事件重写
            }
        }
    };
};
