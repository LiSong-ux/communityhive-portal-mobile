<template>
    <div class="home">
        <table class="table_notice">
            <tr class="tr_head border_bottom">
                <th class="th_title" align="left" colspan="2">
                    <div class="title_box">全部公告</div>
                </th>
                <!--<th align="center">作者</th>
                <th align="center">查看</th>
                <th align="center">最后修改</th>-->
            </tr>
            <!--<tr class="tr_topic" v-for="(notice, index) in noticeList" :key="index">
                <td :class="index==noticeList.length-1?'notice_label':'notice_label border_bottom'" align="center">
                    【<span>{{ notice.label }}</span>】
                </td>
                <td :class="index==noticeList.length-1?'title':'title border_bottom'">
                    <router-link :to="'/toNotice?id='+notice.id">{{ notice.title }}</router-link>
                </td>
                <td :class="index==noticeList.length-1?'author':'author border_bottom'">
                    <h3>{{ notice.username }}</h3>
                    <p>{{ notice.submitTime | dateFormat }}</p>
                </td>
                <td :class="index==noticeList.length-1?'reply_view':'reply_view border_bottom'">
                    <p>{{ notice.viewCount }}</p>
                </td>
                <td :class="index==noticeList.length-1?'latestReply':'latestReply border_bottom'">
                    <h3>{{ notice.lastEdit }}</h3>
                    <p>{{ notice.lastSubmitTime | dateFormat }}</p>
                </td>
            </tr>-->
            <div :class="index==noticeList.length-1?'table_body':'table_body border_bottom'" v-for="(notice, index) in noticeList" :key="index">
                <div>
                    【<span class="notice_label">{{ notice.label }}</span>】
                    <span class="submitTime">{{ notice.submitTime | dateFormat }}</span>
                </div>
                <div class="title">
                    <router-link :to="'/toNotice?id='+notice.id">{{ notice.title }}</router-link>
                </div>
                <div class="author_count">
                    <!--<span>{{ topic.username }}</span>
                    <span>{{ topic.replycount }}</span>-->
                    <div class="author">{{ notice.username }}</div>
                    <div class="count">
                        <div class="count_view">
                            <Icon type="md-eye" />
                            <span> {{ notice.viewCount }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </table>
        <table class="table_topic">
            <tr class="tr_head border_bottom">
                <th class="th_title" align="left" colspan="2">
                    <div class="title_box">全部主题</div>
                </th>
                <!--<th align="center">作者</th>
                <th align="center">回复 / 查看</th>
                <th align="center">最后发表</th>-->
            </tr>
            <!--<tr class="tr_topic" v-for="(topic, index) in topicList" :key="index">
                <td :class="index==topicList.length-1?'label':'label border_bottom'" align="center">
                    【<span>{{ topic.label }}</span>】
                </td>
                <td :class="index==topicList.length-1?'title':'title border_bottom'" colspan="3">
                    <router-link :to="'/toTopic?id='+topic.id">{{ topic.title }}</router-link>
                </td>
                <td :class="index==topicList.length-1?'author':'author border_bottom'">
                    <h3>{{ topic.username }}</h3>
                    <p>{{ topic.submittime | dateFormat }}</p>
                </td>
                <td :class="index==topicList.length-1?'reply_view':'reply_view border_bottom'">
                    <h3>{{ topic.replycount }}</h3>
                    <p>{{ topic.viewcount }}</p>
                </td>
                <td :class="index==topicList.length-1?'latestReply':'latestReply border_bottom'">
                    <h3>{{ topic.lastReply }}</h3>
                    <p>{{ topic.lastSubmit | dateFormat }}</p>
                </td>
            </tr>-->
            <div :class="index==topicList.length-1?'table_body':'table_body border_bottom'" v-for="(topic, index) in topicList" :key="index">
                <div>
                    【<span class="label">{{ topic.label }}</span>】
                    <span class="submitTime">{{ topic.submitTime | dateFormat }}</span>
                </div>
                <div class="title">
                    <router-link :to="'/toTopic?id='+topic.id">{{ topic.title }}</router-link>
                </div>
                <div class="author_count">
                    <!--<span>{{ topic.username }}</span>
                    <span>{{ topic.replycount }}</span>-->
                    <div class="author">{{ topic.username }}</div>
                    <div class="count">
                        <div class="count_reply">
                            <Icon type="md-text" />
                            <span> {{ topic.replyCount }}</span>
                        </div>
                        <div class="count_view">
                            <Icon type="md-eye" />
                            <span> {{ topic.viewCount }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </table>
        <div class="paging_box">
            <Page v-if="paging.total>0" :current="paging.currentPage" :page-size="paging.pageSize"
                  :total="paging.total" show-elevator @on-change="changePage"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                noticeList:[],
                topicList: [],
                paging: {
                    currentPage: 1,
                    pageSize: 45,
                    total: 0,
                },
                form: {
                    page: 1,
                    terminal: ''
                }
            }
        },
        created: function () {
            this.init();
        },
        methods: {
            init() {
                this.getTopicList();
                this.getNoticeList();
            },
            getNoticeList() {
                let initParams = {
                    'terminal': navigator.userAgent
                };
                let params = this.qs.stringify(initParams);
                this.axios.post('/noticeList', params).then(response => {
                    let resp = response.data;
                    if (resp.status != 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    this.noticeList = resp.data;
                });
            },
            getTopicList() {
                let initParams = {
                    'page': this.paging.currentPage,
                    'terminal': navigator.userAgent
                };
                let params = this.qs.stringify(initParams);
                this.axios.post('/topicList', params).then(response => {
                    let resp = response.data;
                    if (resp.status != 200) {
                        this.$Message.error(resp.msg);
                        return;
                    }
                    this.topicList = resp.data.topicList;
                    this.paging.total = resp.data.topicCount;
                });
            },
            changePage(page) {
                this.paging.currentPage = page;
                this.getTopicList();
            },
        }
    }
</script>

<style scoped lang="scss">
    .home {
        width: 100%;
        padding: 0px 10px 10px 10px;
        border-radius: 10px;
        background-color: #fff;
        overflow: hidden;
    }

    .table_notice {
        width: 100%;
        border-collapse: collapse;
    }

    .notice_label {
        width: 14%;
        font-size: 1.2em;
        color: red;
    }

    .table_topic {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
    }

    .tr_head {
        height: 40px;
        font-size: 1.2em;
        font-weight: bold;
    }

    /*.th_title {
        border-left: 6px solid dodgerblue;
    }*/
    .title_box {
        padding-left: 15px;
        border-left: 6px solid dodgerblue;
    }

    .table_body {
        overflow: hidden;
        margin-top: 10px;
    }

    .label {
        width: 14%;
        font-size: 1.2em;
        color: #ff78f2;
    }

    .submitTime {
        font-size: 1.0em;
        /*font-weight: bold;*/
    }

    .title {
        font-size: 1.2em;
        font-weight: bold;
        a {
            color: #515a6e;
        }
    }

    .author {
        float: left;
        color: #808695;
    }

    .count {
        float: right;
    }

    .count_reply {
        display: inline;
        margin-right: 10px;
    }

    .count_view {
        display: inline;
    }

    .border_bottom {
        border-bottom: 1px solid #999;
    }

    .paging_box {
        float: right;
        margin: 20px 0px 0px 0px;
    }
</style>
