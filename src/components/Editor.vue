<template>
    <div id="globalEditor">
        <div class="edit_container" ref="editor"></div>
        <!--<button v-on:click="getContent">查看内容</button>-->
    </div>
</template>

<script>
    import E from 'wangeditor';

    export default {
        name: 'editor',
        props: {
            isClear: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                editor: null,
                editorContent: ''
            }
        },
        watch: {
            isClear(val) {
                // 触发清除文本域内容
                if (val) {
                    this.editor.txt.clear();
                }
            },
        },
        methods: {
            getContent: function () {
                this.$store.commit('setContent', this.editorContent);
            }
        },
        mounted() {
            this.editor = new E(this.$refs.editor);
            // 设置编辑器菜单
            this.editor.customConfig.menus = [
                // 'head',  // 标题
                'bold',  // 粗体
                // 'fontSize',  // 字号
                // 'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                // 'foreColor',  // 文字颜色
                // 'backColor',  // 背景颜色
                // 'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                // 'video',  // 插入视频
                // 'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            this.editor.customConfig.onchange = (html) => {
                //执行xss过滤
                // this.editorContent = xss(html);
                this.editorContent = html;
            };
            this.editor.customConfig.zIndex = 1000;
            this.editor.customConfig.showLinkImg = false;
            this.editor.customConfig.uploadImgServer = this.uploadServer;
            this.editor.customConfig.uploadFileName = 'file';
            this.editor.customConfig.withCredentials = true
            this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
            this.editor.customConfig.uploadImgMaxLength = 5;
            this.editor.customConfig.uploadImgTimeout = 10 * 1000
            this.editor.customConfig.uploadImgHooks = {
                fail: (xhr, editor, result) => {
                    if (result.errno === 1) {
                        this.$Modal.error({
                            title: '操作失败！',
                            content: '请登录后上传',
                        });
                    } else if (result.errno === 2) {
                        this.$Modal.error({
                            title: '操作失败！',
                            content: '图片不能为空',
                        });
                    } else if (result.errno === 3) {
                        this.$Modal.error({
                            title: '操作失败！',
                            content: '只支持jpg、jpeg、png、bmp、gif格式的图片',
                        });
                    } else {
                        this.$Modal.error({
                            title: '操作失败！',
                            content: '上传出现错误，请稍后重试',
                        });
                    }
                },
                timeout: () => {
                    // 网络超时的回调
                    this.$Modal.error({
                        title: '操作失败！',
                        content: '网络传输超时，请重试',
                    });
                },
                error: () => {
                    // 图片上传错误的回调
                    this.$Modal.error({
                        title: '操作失败！',
                        content: '上传出现错误，请稍后再试',
                    });
                }
            }
            //自定义alert
            this.editor.customConfig.customAlert = () => {
            }
            this.editor.create();
        }
    }
</script>

<style scoped>
    .edit_container {
        text-align: left;
        margin-bottom: 20px;
    }
</style>
<style lang="scss">
    #globalEditor{
        .w-e-toolbar {
            // 给工具栏换行
            flex-wrap: wrap;
        }
    }
</style>
