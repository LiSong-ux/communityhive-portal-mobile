<template>
    <div class="page_main">
        <div class="page_content">
            <div class="topic">
                <div class="topic_top">
                    <div class="topic_label">【<span>{{ topic.label }}</span>】</div>
                    <div class="topic_title">{{ topic.title }}</div>
                </div>
                <div class="topic_head">
                    <div class="topic_author">{{ topic.username }}</div>
                    <div class="floor">楼主</div>
                </div>
                <div class="topic_content" v-html="topic.content"></div>
                <div class="reply_operate">
                    <a @click="showModal(0)">回复</a>
                    <span>{{ topic.submittime | dateFormat }}</span>
                </div>
            </div>
            <div class="reply" v-for="(reply, index) in pageReplyList" :key="index">
                <div class="reply_head">
                    <div class="reply_author">{{ reply.username }}</div>
                    <!--<div class="reply_time">发表于 {{ reply.submittime | dateFormat }}</div>-->
                    <div class="floor">{{ reply.floor }}楼</div>
                </div>
                <div class="reply_content">
                    <div class="reply_quote" v-if="reply.quote!=0">
                        <!--<div class="quote_icon_e">-->
                        <div class="reply_quote_head">
                            <span class="font_quote">引用 @</span>
                            <span class="reply_quote_info">{{ replyList[reply.quoteIndex].username }}</span>
                            <span class="font_quote"> 发表的</span>
                            <span class="reply_quote_floor">{{ replyList[reply.quoteIndex].floor }}楼</span>
                        </div>
                        <span v-html="replyList[reply.quoteIndex].content"></span>
                        <!--</div>-->
                    </div>
                    <span v-html="reply.content"></span>
                </div>
                <div class="reply_operate">
                    <a @click="showModal(reply.floor)">回复</a>
                    <span>{{ reply.submittime | dateFormat }}</span>
                </div>
            </div>
            <div class="paging_box">
                <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                      :total="paging.total" show-elevator @on-change="changePage"/>
            </div>
        </div>
        <div class="submit_reply">
            <editor ref="editor" :isClear="isClear"></editor>
            <Button class="submit_button" type="primary" @click="submitReply(0)">回复</Button>
        </div>
        <Modal class="modal_reply" v-model="modal" footer-hide>
            <div class="reply_quote" v-if="isShowQu">
                <div class="quote_icon_e">
                    <div class="reply_quote_head">
                        <span class="font_quote">引用 @</span>
                        <span class="reply_quote_info">{{ toQuote.username }}</span>
                        <span class="font_quote"> 发表的</span>
                        <span class="reply_quote_floor">{{ toQuote.floor }}楼</span>
                    </div>
                    <div class="modal_reply_overflow" v-html="toQuote.content"></div>
                </div>
            </div>
            <editor ref="editor_qu" :isClear="isClear"></editor>
            <Button class="submit_button" type="primary" @click="submitReply(1)">回复</Button>
        </Modal>
    </div>
</template>

<script>
    import Editor from '../components/Editor'

    export default {
        name: "Topic",
        components: {Editor},
        data() {
            return {
                topic: {},
                replyList: [],
                pageReplyList: [],
                newReply: {},
                toQuote: {},
                quoteFloor: 0,
                modal: false,
                isShowQu: true,
                isClear: false,
                paging: {
                    currentPage: 1,
                    pageSize: 50,
                    total: 0,
                },
            }
        },
        created: function () {
            this.init();
        },
        methods: {
            init() {
                this.getTopic();
            },
            getTopic() {
                let initParams = {
                    'id': this.$route.query.id,
                    'page': this.paging.currentPage,
                    'terminal': navigator.userAgent
                };
                let params = this.qs.stringify(initParams);
                this.axios.post('/topic', params).then(response => {
                    let resp = response.data;
                    if (resp.status != 200) {
                        this.$Message.error(resp.msg);
                        this.$router.push('/');
                        return;
                    }
                    this.topic = resp.data.topic;
                    this.pageReplyList = resp.data.replyList;
                    for (let i = 0; i < this.pageReplyList.length; i++) {
                        if (this.pageReplyList[i].quote != 0) {
                            this.pageReplyList[i].quoteIndex = this.pageReplyList[i].quote - 1;
                        }
                    }
                    let lastIndex_f = this.replyList.length - 1;
                    if (this.replyList.length == 0 || this.replyList[lastIndex_f].floor < resp.data.replyList[0].floor) {
                        for (let i = 0; i < resp.data.replyList.length; i++) {
                            this.replyList.push(resp.data.replyList[i]);
                        }
                    }
                    let lastIndex_s = this.replyList.length - 1;
                    let respLastIndex = resp.data.replyList.length - 1;
                    if (this.replyList.length != 0 && this.replyList[lastIndex_s].floor >= resp.data.replyList[0].floor && this.replyList[lastIndex_s].floor < resp.data.replyList[respLastIndex].floor) {
                        for (let i = 0; i < resp.data.replyList.length; i++) {
                            if (this.replyList[lastIndex_s].floor < resp.data.replyList[i].floor) {
                                this.replyList.push(resp.data.replyList[i]);
                            }
                        }
                    } else if (this.replyList.length != 0 && this.replyList[0].floor < resp.data.replyList[0].floor && this.replyList[lastIndex_s].floor > resp.data.replyList[respLastIndex].floor) {
                        for (let i = 0; i < this.replyList.length; i++) {
                            if (this.replyList[i].floor == resp.data.replyList[0].floor) {
                                break;
                            } else if (this.replyList[i].floor > resp.data.replyList[0].floor) {
                                for (let j = 0; j < resp.data.replyList.length; j++) {
                                    this.replyList.splice(i, 0, resp.data.replyList[j]);
                                }
                                break;
                            }
                        }
                    }
                    this.paging.total = resp.data.replyCount;
                    this.isClear = false;
                });
            },
            submitReply(num) {
                if (num == 0) {
                    this.quoteFloor = 0;
                    this.$refs.editor.getContent();
                } else {
                    this.$refs.editor_qu.getContent();
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
                this.newReply.topicId = this.$route.query.id;
                this.newReply.quote = this.quoteFloor;
                this.newReply.content = this.$store.getters.getContent;
                this.newReply.terminal = navigator.userAgent;
                let params = this.qs.stringify(this.newReply);
                this.axios.post('/submitReply', params).then(response => {
                    let resp = response.data;
                    if (resp.status != 200) {
                        this.instance('error', resp.msg);
                        return;
                    }
                    this.isClear = true;
                    this.$refs.editor.editorContent = '';
                    this.modal = false;
                    this.getTopic();
                })
            },
            showModal(floor) {
                if (floor == 0) {
                    this.isShowQu = false;
                } else {
                    this.isShowQu = true;
                    this.toQuote = this.replyList[floor - 1];
                    this.quoteFloor = floor;
                }
                this.modal = true;
            },
            changePage(page) {
                this.paging.currentPage = page;
                this.getTopic();
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
    .page_main {
        width: 100%;
        border-radius: 10px;
    }


    .page_content {
        width: 100%;
        padding: 30px 0px;
        border-radius: 10px;
        background-color: #fff;
        overflow: hidden;
    }


    .topic {
        width: 96%;
        padding: 20px 10px 0px 10px;
        margin: 0px auto;
        border-radius: 10px;
        border: 2px solid #819799;
    }

    .topic_top {
        width: 100%;
        padding: 0px 15px;
        border-bottom: 3px solid #1c5899;
    }

    .topic_label {
        display: inline;

        span {
            color: #ff78f2;
        }
    }

    .topic_title {
        display: inline;
        padding: 10px 5px;
        font-size: 1.3em;
        font-weight: bold;
    }

    .topic_head {
        width: 100%;
        font-size: 1.0em;
        margin-top: 25px;
        padding-bottom: 5px;
        border-bottom: 1px solid #999;
    }

    .topic_author {
        color: #27313e;
        display: inline;
        margin-left: 15px;
    }

    .topic_content {
        width: 100%;
        padding: 0px 15px;
        margin-top: 25px;
        font-size: 1.3em;
        color: black;
    }


    .reply {
        width: 96%;
        padding: 20px 10px;
        margin: 10px auto;
    }

    .reply_head {
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #999;
    }

    .reply_author {
        float: left;
        color: #27313e;
        font-size: 1.0em;
        margin-left: 15px;
    }

    .floor {
        float: right;
        font-size: 1.2em;
        margin-right: 15px;
    }

    .reply_content {
        width: 100%;
        padding: 0px 15px;
        margin-top: 25px;
        font-size: 1.3em;
        color: #515a6e;
        word-wrap: break-word;
    }


    .reply_quote {
        width: 100%;
        margin: 10px 0px 25px 0px;
        background-color: #eeebeb;
        padding: 10px 10px 10px 15px;
    }

    .font_quote {
        font-size: 0.8em;
    }

    .reply_quote_info {
        font-size: 0.8em;
        font-weight: bold;
        color: #005eac;
    }

    .reply_quote_floor {
        float: right;
        font-size: 1.0em;
        font-weight: bold;
        color: darkgrey;
        margin-left: 15px;
    }

    .reply_operate {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0px 15px;
        margin-top: 15px;

        a {
            color: #333333;
            opacity: 0.3;
            padding: 5px 10px 5px 25px;
            background: url("../assets/icons/fastreply.gif") no-repeat 0 50%;
        }

        span {
            float: right;
            opacity: 0.9;
            color: cadetblue;
        }
    }

    .reply_operate:hover {
        width: 100%;
        height: 50px;
        opacity: 1;
        line-height: 50px;
        padding: 0px 15px;
        margin-top: 15px;
        background: url("../assets/icons/lattice.png") left top repeat-x;

        a {
            color: #333333;
            padding: 5px 10px 5px 25px;
            background: url("../assets/icons/fastreply.gif") no-repeat 0 50%;
        }
    }


    .submit_reply {
        width: 100%;
        padding: 35px 20px;
        margin: 30px auto;
        border-radius: 10px;
        background-color: #fff;
    }


    .modal_reply /deep/ .ivu-modal-body {
        padding: 35px 15px 15px 15px !important;
    }

    /*.modal_reply /deep/ .ivu-modal-wrap {
        z-index: 11010 !important;
    }*/

    .modal_reply_overflow {
        width: 100%;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .submit_button {
        width: 120px;
    }

    .paging_box {
        float: right;
        margin: 0px 45px 0px 0px;
    }
</style>
