<template>
  <div class="login-root">
    <div class="login-bg" aria-hidden="true">
<div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
    </div>

    <div class="login-layout">
      <!-- LEFT panel (lg+) -->
      <div class="left-panel">
        <div class="left-logo">
          <div class="logo-mark">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span class="logo-ring" />
          </div>
          <div>
            <p class="logo-name">RuleAI</p>
            <p class="logo-sub">by DomRock</p>
          </div>
        </div>

        <div class="left-hero">
          <div class="hero-eyebrow">
            <span class="hero-dot" />
            Plataforma de Regras Inteligentes
          </div>
          <h1 class="hero-title">
            Regras de negócio com o poder da
            <span class="hero-gradient">Inteligência Artificial</span>
          </h1>
          <p class="hero-desc">
            Transforme descrições em linguagem natural em regras estruturadas, validadas e auditáveis em segundos.
          </p>
        </div>
      </div>

      <!-- RIGHT panel -->
      <div class="right-panel">
        <div class="form-card">
          <div class="mobile-logo">
            <div class="logo-mark" style="width:32px;height:32px;border-radius:9px">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-white font-bold text-base">RuleAI</span>
          </div>

          <div class="form-header">
            <p class="form-eyebrow">Bem-vindo de volta</p>
            <h2 class="form-title">Entre na sua conta</h2>
          </div>

          <form class="form-body" @submit.prevent="handleLogin" novalidate>
            <!-- Email -->
            <div class="field-group" :class="{ 'field-error': errors.email, 'field-focused': focused === 'email' }">
              <label class="field-label">Email</label>
              <div class="field-wrap">
                <div class="field-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input v-model="form.email" type="email" placeholder="seu@email.com" class="field-input"
                  autocomplete="email" @focus="focused = 'email'" @blur="focused = null; validateField('email')" />
                <Transition name="fade-scale">
                  <div v-if="form.email && !errors.email" class="field-check">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </Transition>
              </div>
              <Transition name="fade-down">
                <p v-if="errors.email" class="field-error-msg">{{ errors.email }}</p>
              </Transition>
            </div>

            <!-- Password -->
            <div class="field-group" :class="{ 'field-error': errors.password, 'field-focused': focused === 'password' }">
              <div class="flex items-center justify-between">
                <label class="field-label">Senha</label>
                <button type="button" class="forgot-link" tabindex="-1">Esqueceu a senha?</button>
              </div>
              <div class="field-wrap">
                <div class="field-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="Mínimo 6 caracteres"
                  class="field-input" autocomplete="current-password"
                  @focus="focused = 'password'" @blur="focused = null; validateField('password')" />
                <button type="button" class="pw-toggle" @click="showPw = !showPw">
                  <svg v-if="!showPw" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <Transition name="fade-down">
                <p v-if="errors.password" class="field-error-msg">{{ errors.password }}</p>
              </Transition>
            </div>

            <!-- Auth error -->
            <Transition name="fade-down">
              <div v-if="authStore.error" class="error-banner">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ authStore.error }}</span>
              </div>
            </Transition>

            <button type="submit" class="submit-btn" :disabled="authStore.loading">
              <span class="submit-content">
                <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {{ authStore.loading ? 'Verificando...' : 'Entrar' }}
              </span>
            </button>

            <div class="form-divider">
              <span class="form-divider-line" />
              <span class="form-divider-text">ou continue com</span>
              <span class="form-divider-line" />
            </div>

            <div class="social-row">
              <button type="button" class="social-btn">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" class="social-btn">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#0078d4">
                  <path d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21c2.76 0 5.26-1.11 7.09-2.91L16.17 15.7A6.47 6.47 0 0111.5 18 6.5 6.5 0 015 11.5 6.5 6.5 0 0111.5 5c1.83 0 3.47.75 4.66 1.96l1.43-1.43A9.46 9.46 0 0011.5 2zm9.37 8.38L22 12l-1.13 1.62-3.37-3.37 3.37-3.37L22 8.5l-1.13 1.88z"/>
                </svg>
                Microsoft
              </button>
            </div>
          </form>

          <div class="form-footer">
            <span>Não tem uma conta?</span>
            <RouterLink to="/register" class="form-footer-link">
              Criar conta grátis
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPw = ref(false)
const focused = ref(null)

const validateField = (field) => {
  if (field === 'email') {
    errors.email = !form.email ? 'Email é obrigatório'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Email inválido' : ''
  } else {
    errors.password = form.password.length >= 6 ? '' : 'Mínimo de 6 caracteres'
  }
}

const handleLogin = async () => {
  validateField('email'); validateField('password')
  if (errors.email || errors.password) return
  const ok = await authStore.login(form.email, form.password)
  if (ok) router.push('/rules')
}
</script>

<style scoped>
.login-root { min-height: 100vh; display: flex; position: relative; overflow: hidden; background: #111827; }

.login-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); }
.blob-1 { width: 650px; height: 650px; background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%); top: -220px; left: -180px; animation: blobDrift 18s ease-in-out infinite alternate; }
.blob-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%); bottom: -160px; right: -120px; animation: blobDrift 22s ease-in-out infinite alternate-reverse; }
.blob-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); top: 38%; left: 33%; animation: blobDrift 15s ease-in-out infinite alternate; animation-delay: -5s; }
@keyframes blobDrift { 100% { transform: translate(40px, 30px) scale(1.08); } }

.login-layout { position: relative; z-index: 10; display: flex; width: 100%; min-height: 100vh; }

.left-panel {
  display: none; flex-direction: column; justify-content: space-between;
  width: 520px; flex-shrink: 0; padding: 48px 52px;
  border-right: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(165deg, rgba(99,102,241,0.09) 0%, transparent 60%);
  animation: panelIn 0.7s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 1024px) { .left-panel { display: flex; } }
@keyframes panelIn { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }

.left-logo { display: flex; align-items: center; gap: 12px; }
.logo-mark {
  position: relative; width: 40px; height: 40px; border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 4px 20px rgba(99,102,241,0.3);
}
.logo-ring { position: absolute; inset: -4px; border-radius: 16px; border: 1px solid rgba(99,102,241,0.25); animation: ringPulse 3s ease-in-out infinite; }
@keyframes ringPulse { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:.1; transform:scale(1.07); } }
.logo-name { font-size: 16px; font-weight: 800; color: white; letter-spacing: -0.02em; line-height: 1; }
.logo-sub { font-size: 10px; font-weight: 500; color: rgba(148,163,184,0.7); margin-top: 2px; letter-spacing: 0.06em; text-transform: uppercase; }

.left-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 20px; }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #a5b4fc; letter-spacing: 0.08em; text-transform: uppercase; }
.hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #818cf8; box-shadow: 0 0 8px rgba(129,140,248,0.8); animation: dotPulse 2s ease-in-out infinite; }
@keyframes dotPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.4); box-shadow:0 0 16px rgba(129,140,248,0.4); } }
.hero-title { font-size: 36px; font-weight: 800; line-height: 1.15; color: white; letter-spacing: -0.03em; }
.hero-gradient { background: linear-gradient(135deg, #818cf8, #c084fc, #a78bfa); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.hero-desc { font-size: 14px; line-height: 1.7; color: rgba(203,213,225,0.8); max-width: 380px; }

.right-panel { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; gap: 20px; animation: formIn 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s both; }
@keyframes formIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }

.mobile-logo { display: flex; align-items: center; gap: 8px; padding: 32px 32px 0; }
@media (min-width: 1024px) { .mobile-logo { display: none; } }

.form-card {
  width: 100%; max-width: 620px;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13);
  border-radius: 24px; backdrop-filter: blur(24px) saturate(1.5); overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
}
.form-card::before { content: ''; display: block; height: 1px; background: linear-gradient(90deg, transparent, rgba(129,140,248,0.4), rgba(192,132,252,0.3), transparent); }

.form-header { padding: 28px 32px 0; }
.form-eyebrow { font-size: 13px; color: rgba(203,213,225,0.75); margin-bottom: 6px; }
.form-title { font-size: 26px; font-weight: 800; color: white; letter-spacing: -0.025em; line-height: 1.2; }
.form-sub { font-size: 13px; color: rgba(203,213,225,0.6); margin-top: 6px; }

.form-body { padding: 24px 32px 0; display: flex; flex-direction: column; gap: 18px; }

.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; font-weight: 700; color: rgba(203,213,225,0.85); text-transform: uppercase; letter-spacing: 0.08em; }
.forgot-link { font-size: 11px; font-weight: 500; color: rgba(129,140,248,0.7); background: none; border: none; cursor: pointer; padding: 0; transition: color 0.2s; }
.forgot-link:hover { color: #818cf8; }

.field-wrap { display: flex; align-items: center; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 13px; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
.field-group.field-focused .field-wrap { border-color: rgba(99,102,241,0.55); background: rgba(99,102,241,0.06); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
.field-group.field-error .field-wrap { border-color: rgba(248,113,113,0.5); background: rgba(248,113,113,0.04); box-shadow: 0 0 0 3px rgba(248,113,113,0.08); }

.field-icon { width: 42px; display: flex; align-items: center; justify-content: center; color: rgba(148,163,184,0.6); flex-shrink: 0; transition: color 0.2s; }
.field-group.field-focused .field-icon { color: #818cf8; }
.field-input { flex: 1; background: transparent; border: none; outline: none; font-size: 14px; color: rgba(255,255,255,0.9); padding: 12px 12px 12px 0; caret-color: #818cf8; }
.field-input::placeholder { color: rgba(148,163,184,0.5); }
.field-check { width: 36px; display: flex; align-items: center; justify-content: center; color: #34d399; flex-shrink: 0; }
.pw-toggle { width: 40px; display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: rgba(148,163,184,0.55); transition: color 0.2s; }
.pw-toggle:hover { color: rgba(203,213,225,0.9); }
.field-error-msg { font-size: 11px; color: #f87171; padding-left: 2px; }

.error-banner { display: flex; align-items: center; gap: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 11px 14px; font-size: 13px; color: #f87171; }

.submit-btn {
  width: 100%; border: none; cursor: pointer;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; border-radius: 13px; padding: 14px 20px;
  font-size: 14px; font-weight: 700; position: relative; overflow: hidden;
  transition: transform 0.15s, box-shadow 0.2s, filter 0.2s;
  box-shadow: 0 4px 20px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
}
.submit-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%); pointer-events: none; }
.submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15); filter: brightness(1.06); }
.submit-btn:active:not(:disabled) { transform: scale(0.99); }
.submit-btn:disabled { cursor: not-allowed; opacity: 0.7; }
.submit-content { display: flex; align-items: center; justify-content: center; gap: 8px; }

.form-divider { display: flex; align-items: center; gap: 12px; }
.form-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.12); }
.form-divider-text { font-size: 11px; color: rgba(148,163,184,0.55); white-space: nowrap; font-weight: 500; }

.social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-bottom: 4px; }
.social-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 11px; padding: 11px 16px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); cursor: pointer; transition: background 0.2s, border-color 0.2s, color 0.2s; }
.social-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.22); color: white; }

.form-footer { padding: 20px 32px 28px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: rgba(203,213,225,0.6); border-top: 1px solid rgba(255,255,255,0.09); margin-top: 20px; }
.form-footer-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 700; color: #818cf8; text-decoration: none; transition: color 0.2s, gap 0.2s; }
.form-footer-link:hover { color: #a5b4fc; gap: 6px; }

.fade-scale-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-scale-leave-active { transition: opacity 0.15s ease; }
.fade-scale-enter-from { opacity: 0; transform: scale(0.5); }
.fade-scale-leave-to { opacity: 0; }

.fade-down-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-down-leave-active { transition: opacity 0.15s ease; }
.fade-down-enter-from { opacity: 0; transform: translateY(-4px); }
.fade-down-leave-to { opacity: 0; }
</style>
