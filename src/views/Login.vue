<template>
    <div class="main">
        <div class="container">
            <div class="container_head">登录</div>
            <Form class="container_form" :model="form" label-position="top">
                <FormItem label="用户名">
                    <Input v-model="form.account"/>
                </FormItem>
                <FormItem label="密码">
                    <Input type="password" v-model="form.password"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="login">登录</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    account: '',
                    password: '',
                    terminal: '',
                }
            }
        },
        methods: {
            login() {
                this.form.terminal = navigator.userAgent;
                let params = this.qs.stringify(this.form);
                this.axios.post("/login", params).then(response => {
                    let resp = response.data;
                    if (resp.status != 200) {
                        this.instance('error', resp.msg);
                        return;
                    }
                    this.$store.commit("setUser", resp.data);
                    this.$router.push("/");
                })
            },
            instance(type, content) {
                switch (type) {
                    case 'success':
                        this.$Modal.success({
                            title: '操作成功！',
                            content: content
                        });
                        break;
                    case 'error':
                        this.$Modal.error({
                            title: '操作失败！',
                            content: content
                        });
                        break;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .main {
        width: 100%;
        padding: 10px;
        background-color: #dcdee2;
        /*border: 2px solid #999;*/
    }

    .container {
        width: 40%;
        height: 350px;
        padding-top: 30px;
        margin: 22px auto;
        border-radius: 10px;
        background-color: #f8f8f9;
    }

    .container_head {
        font-size: 2.0em;
        font-weight: bold;
        text-align: center;
    }

    .container_form {
        width: 80%;
        margin: 30px auto;

        Button {
            width: 100%;
        }
    }
</style>
