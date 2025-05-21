<template>
    <div class="review-page">
        <h2>点歌审核</h2>
        <button @click="logout" class="logout-btn">退出登录</button>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else>
            <div v-if="songs.length === 0" class="empty">暂无待审核点歌</div>
            <div v-for="song in songs" :key="song.id" class="song-card">
                <div class="song-header">
                    <div>
                        <span class="label">学号：</span>{{ song.student_id }}
                        <span class="label">姓名：</span>{{ song.name }}
                    </div>
                    <div>
                        <span class="label">歌曲ID：</span>{{ song.song_id }}
                        <span class="label">请求时间：</span>{{ formatTime(song.request_time) }}
                    </div>
                </div>
                <div class="review-actions">
                    <input v-model="reasons[song.id]" placeholder="审核理由（可选）" />
                    <button class="approve-btn" @click="review(song.id, 'approved')">通过</button>
                    <button class="reject-btn" @click="review(song.id, 'rejected')">驳回</button>
                </div>
            </div>
        </div>

        <!-- 弹窗提示 -->
        <div v-if="toast.show" :class="['toast', toast.success ? 'toast-success' : 'toast-error']">
            {{ toast.message }}
            <span class="toast-close" @click="toast.show = false">&times;</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const songs = ref([])
const loading = ref(false)
const reasons = ref({})
const router = useRouter()

const toast = ref({
    show: false,
    message: '',
    success: true,
})

function showToast(msg, success = true, timeout = 2000) {
    toast.value = { show: true, message: msg, success }
    if (timeout > 0) setTimeout(() => (toast.value.show = false), timeout)
}
const backendUrl = 'http://localhost:8000'
const urlPrefix = "/api/admin"
const fetchSongs = async () => {
    loading.value = true
    const token = localStorage.getItem('admin_token')
    const res = await fetch(`${backendUrl}${urlPrefix}/song/list?status=pending`, {
        headers: { Authorization: 'Bearer ' + token },
    })
    const data = await res.json()
    songs.value = data.songs || []
    loading.value = false
}

const review = async (song_request_id, status) => {
    const reason = reasons.value[song_request_id] || ""
    const token = localStorage.getItem('admin_token')
    const res = await fetch(`${backendUrl}${urlPrefix}/song/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ song_request_id, status, reason }),
    })
    const data = await res.json()
    if (data.success) {
        showToast('审核成功', true)
        songs.value = songs.value.filter(s => s.id !== song_request_id)
    } else if (data.detail) {
        showToast(data.detail, false, 3000)
    } else {
        showToast('审核失败', false, 3000)
    }
}

const logout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
}

function formatTime(t) {
    if (!t) return ''
    return new Date(t).toLocaleString()
}

onMounted(fetchSongs)
</script>

<style scoped>
.review-page {
    max-width: 700px;
    margin: 40px auto;
    background: #fafbfc;
    padding: 32px 24px 60px 24px;
    border-radius: 14px;
    box-shadow: 0 4px 24px #eee;
    position: relative;
}

h2 {
    text-align: center;
    color: #007aff;
    margin-bottom: 20px;
    letter-spacing: 2px;
}

.loading,
.empty {
    text-align: center;
    color: #888;
    margin: 40px 0;
    font-size: 18px;
}

.song-card {
    margin: 18px 0;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px #e3e8f7;
    padding: 18px 18px 14px 18px;
    transition: box-shadow 0.2s;
}

.song-card:hover {
    box-shadow: 0 8px 24px #e3e8f7;
}

.song-header {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 10px;
}

.label {
    color: #007aff;
    font-weight: 600;
    margin-right: 10px;
}

.review-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 6px;
}

.review-actions input {
    flex: 1;
    padding: 6px 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 14px;
    transition: border 0.2s;
}

.review-actions input:focus {
    border: 1.5px solid #007aff;
}

.approve-btn,
.reject-btn {
    padding: 6px 18px;
    border: none;
    border-radius: 5px;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.18s;
}

.approve-btn {
    background: #4caf50;
    color: #fff;
}

.approve-btn:hover {
    background: #388e3c;
}

.reject-btn {
    background: #ff5252;
    color: #fff;
}

.reject-btn:hover {
    background: #e53935;
}

/* 顶部退出按钮 */
.logout-btn {
    position: absolute;
    right: 40px;
    top: 32px;
    background: #e53935;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 4px 16px;
    cursor: pointer;
    font-size: 15px;
    z-index: 2;
    transition: background 0.2s;
}

.logout-btn:hover {
    background: #ab2222;
}

/* 弹窗消息条 */
.toast {
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 220px;
    max-width: 80vw;
    padding: 12px 22px 12px 18px;
    border-radius: 8px;
    font-size: 16px;
    z-index: 9999;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.13);
    display: flex;
    align-items: center;
    animation: fadein 0.3s;
}

.toast-success {
    background: #e7fbe9;
    color: #1b8833;
    border: 1.4px solid #38d963;
}

.toast-error {
    background: #fff0f1;
    color: #b71c1c;
    border: 1.4px solid #f44336;
}

.toast-close {
    margin-left: 20px;
    cursor: pointer;
    font-size: 20px;
}

@keyframes fadein {
    from {
        opacity: 0;
        top: 0;
    }

    to {
        opacity: 1;
        top: 30px;
    }
}
</style>