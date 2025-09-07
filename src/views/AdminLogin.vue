<template>
    <div class="admin-login">
        <h2>管理员登录</h2>
        <form @submit.prevent="onSubmit">
            <input v-model="username" placeholder="用户名" autocomplete="username" required />
            <input v-model="password" type="password" placeholder="密码" autocomplete="current-password" required />
            <button :disabled="loading" type="submit">登录</button>
        </form>
        <div class="error" v-if="error">{{ error }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            loading: false,
            error: ""
        }
    },
    methods: {
        async onSubmit() {
            this.error = "";
            this.loading = true;
            try {
                const backendUrl = 'http://127.0.0.1:8000'
                const urlPrefix = "/api/admin"
                const res = await fetch(`${backendUrl}${urlPrefix}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("admin_token", data.token);
                    this.$router.push('/admin/review')
                } else {
                    this.error = data.detail || "登录失败";
                }
            } catch (e) {
                console.error(e);
                this.error = "网络错误";
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
.admin-login {
    max-width: 360px;
    margin: 80px auto;
    padding: 40px 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.09);
}

.admin-login h2 {
    text-align: center;
    margin-bottom: 32px;
}

.admin-login input {
    width: 100%;
    padding: 12px 10px;
    margin-bottom: 18px;
    border: 1px solid #d6d6d6;
    border-radius: 6px;
    font-size: 16px;
}

.admin-login button {
    width: 100%;
    padding: 12px;
    background: #007aff;
    color: #fff;
    border-radius: 6px;
    border: none;
    font-size: 17px;
    cursor: pointer;
}

.admin-login button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    color: #e53935;
    margin-top: 8px;
    text-align: center;
}
</style>