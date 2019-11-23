<template>
    <div class="main">
        <div class="container">
            <h2>发表帖子</h2>
            <!--<div class="topic_top">-->
                <div class="topic_label">
                    <Input v-model="topic.label" maxlength="4" size="large" placeholder="四字标签" style="width: 86px;"/>
                    <span>请输入标签</span>
                </div>
                <div class="topic_title">
                    <Input v-model="topic.title" maxlength="35" show-word-limit size="large" placeholder="请输入标题"
                           style="width: 100%;"/>
                    <div class="topic_title_tips">最多输入35个字符</div>
                </div>
            <!--</div>-->
            <div class="topic_content">
                <editor ref="editor"></editor>
                <Button class="submit_button" type="primary" @click="submitTopic">发表帖子</Button>
            </div>
        </div>
    </div>
</template>

<script>
    import Editor from '../components/Editor'

    export default {
        name: "SubmitTopic",
        components: {Editor},
        data() {
            return {
                topic: {
                    label: '',
                    title: '',
                    content: '',
                    terminal: ''
                }
            }
        },
        // computed: {
        //     content: function () {
        //         return this.$store.getters.getContent;
        //     }
        // },
        created: function () {
            this.init();
        },
        methods: {
            init() {
                if (!this.$store.getters.isLogin) {
                    this.$Message['warning']({
                        background: true,
                        content: '只有登录后才能发帖'
                    });
                    this.$router.push('/toLogin');
                }
            },
            submitTopic() {
                this.$refs.editor.getContent();
                if (this.topic.label === '') {
                    this.$Message.error('请输入帖子标签！');
                    return;
                }
                let reg = /^[\u4e00-\u9fa5]{2,4}$/;
                if (!reg.test(this.topic.label)) {
                    this.$Message.error('标签为2至4位汉字');
                    return;
                }
                if (this.topic.title === '') {
                    this.$Message.error('请输入标题！');
                    return;
                }
                if (this.topic.title.length < 4) {
                    this.$Message.error('帖子标题的长度不得低于4个字符');
                    return
                }
                let validate = this.$store.getters.getContent;
                let validateA = validate.replace(/ /g, '');
                let validateB = validateA.replace(/<p>/g, '');
                let validateC = validateB.replace(/<\/p>/g, '');
                let validateD = validateC.replace(/&nbsp;/g, '');
                let validateE = validateD.replace(/<br>/g, '');
                if (validateE.length == 0) {
                    this.$Message.error('请输入内容！');
                    return;
                }
                this.topic.content = this.$store.getters.getContent;
                this.topic.terminal = navigator.userAgent;
                let params = this.qs.stringify(this.topic);
                this.axios.post('/submitTopic', params).then(response => {
                    let resp = response.data;
                    if (resp.status != 200) {
                        this.instance('error', resp.msg);
                        return;
                    }
                    this.$router.push({path: '/toTopic', query: {id: resp.data}});
                })
            },
            instance(type, content) {
                switch (type) {
                    case 'success':
                        this.$Modal.success({
                            title: '操作成功！',
                            content: content,
                            onOk: () => {
                                this.$router.push('/');
                            },
                        });
                        break;
                    case 'error':
                        this.$Modal.error({
                            title: '操作失败！',
                            content: content
                        });
                        break;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .main {
        width: 100%;
        border-radius: 10px;
        background-color: #fff;
    }

    .container {
        width: 95%;
        padding: 10px 10px;
        margin: 20px auto;
    }

    .topic_top {
        width: 100%;
        margin-top: 20px;
    }

    .topic_label {
        width: 100%;
        margin-top: 15px;
        span {
            margin-left: 10px;
        }
    }

    .topic_title {
        width: 100%;
        margin-top: 15px;
    }

    .topic_title_tips {
        margin-top: 5px;
    }

    .topic_content {
        width: 100%;
        margin-top: 15px;
    }

    .submit_button {
        width: 120px;
    }
</style>
