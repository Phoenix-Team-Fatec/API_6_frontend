<template>
  <div class="reg-root">
    <div class="login-bg" aria-hidden="true">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
    </div>

    <div class="reg-layout">
      <!-- LEFT panel: form -->
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
            <p class="form-eyebrow">Comece agora, é grátis</p>
            <h2 class="form-title">Criar sua conta</h2>
          </div>

          <form class="form-body" @submit.prevent="handleRegister" novalidate>
            <!-- Name -->
            <div class="field-group" :class="{ 'field-error': errors.name, 'field-focused': focused === 'name' }">
              <label class="field-label">Nome completo</label>
              <div class="field-wrap">
                <div class="field-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input v-model="form.name" type="text" placeholder="João Silva" class="field-input"
                  autocomplete="name" @focus="focused = 'name'" @blur="focused = null; validateField('name')" />
                <Transition name="fade-scale">
                  <div v-if="form.name && !errors.name" class="field-check">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </Transition>
              </div>
              <Transition name="fade-down">
                <p v-if="errors.name" class="field-error-msg">{{ errors.name }}</p>
              </Transition>
            </div>

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
              <label class="field-label">Senha</label>
              <div class="field-wrap">
                <div class="field-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="Mínimo 6 caracteres"
                  class="field-input" autocomplete="new-password"
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
              <!-- Strength bar -->
              <div v-if="form.password" class="strength-bar">
                <div v-for="i in 4" :key="i" class="strength-seg" :class="passwordStrength >= i ? strengthColor : 'strength-empty'" />
              </div>
              <Transition name="fade-down">
                <p v-if="errors.password" class="field-error-msg">{{ errors.password }}</p>
              </Transition>
            </div>

            <!-- Confirm password -->
            <Transition name="field-reveal">
            <div v-if="form.password.length >= 1" class="field-group" :class="{ 'field-error': errors.confirmPassword, 'field-focused': focused === 'confirm' }">
              <label class="field-label">Confirmar senha</label>
              <div class="field-wrap">
                <div class="field-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input v-model="form.confirmPassword" type="password" placeholder="Repita a senha"
                  class="field-input" autocomplete="new-password"
                  @focus="focused = 'confirm'" @blur="focused = null; validateField('confirmPassword')" />
                <Transition name="fade-scale">
                  <div v-if="form.confirmPassword && !errors.confirmPassword" class="field-check">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </Transition>
              </div>
              <Transition name="fade-down">
                <p v-if="errors.confirmPassword" class="field-error-msg">{{ errors.confirmPassword }}</p>
              </Transition>
            </div>
            </Transition>

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
                {{ authStore.loading ? 'Criando conta...' : 'Criar conta' }}
              </span>
            </button>
          </form>

          <div class="form-footer">
            <span>Já tem uma conta?</span>
            <RouterLink to="/login" class="form-footer-link">
              Entrar
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- RIGHT panel: branding (lg+) -->
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
            Junte-se a centenas de analistas
          </div>
          <h1 class="hero-title">
            Crie regras inteligentes em
            <span class="hero-gradient">segundos, não horas</span>
          </h1>
          <p class="hero-desc">
            Descreva suas regras de negócio em português e deixe a IA estruturar, validar e registrar tudo por você.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const showPw = ref(false)
const focused = ref(null)

const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let s = 0
  if (p.length >= 6) s++
  if (p.length >= 10) s++
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'strength-red'
  if (passwordStrength.value === 2) return 'strength-amber'
  if (passwordStrength.value === 3) return 'strength-green'
  return 'strength-emerald'
})

const validateField = (field) => {
  if (field === 'name') errors.name = form.name.trim().length >= 2 ? '' : 'Nome é obrigatório'
  else if (field === 'email') errors.email = !form.email ? 'Email é obrigatório' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Email inválido' : ''
  else if (field === 'password') errors.password = form.password.length >= 6 ? '' : 'Mínimo de 6 caracteres'
  else if (field === 'confirmPassword') errors.confirmPassword = form.password === form.confirmPassword ? '' : 'Senhas não coincidem'
}

const handleRegister = async () => {
  ['name', 'email', 'password', 'confirmPassword'].forEach(validateField)
  if (errors.name || errors.email || errors.password || errors.confirmPassword) return
  const ok = await authStore.register(form.name, form.email, form.password)
  if (ok) router.push('/rules')
}
</script>

<style scoped>
.reg-root { min-height: 100vh; display: flex; position: relative; overflow: hidden; background: #111827; }

.login-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); }
.blob-1 { width: 650px; height: 650px; background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%); top: -220px; right: -180px; animation: blobDrift 18s ease-in-out infinite alternate; }
.blob-2 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%); bottom: -160px; left: -120px; animation: blobDrift 22s ease-in-out infinite alternate-reverse; }
.blob-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); top: 38%; left: 33%; animation: blobDrift 15s ease-in-out infinite alternate; animation-delay: -5s; }
@keyframes blobDrift { 100% { transform: translate(40px, 30px) scale(1.08); } }

.reg-layout { position: relative; z-index: 10; display: flex; width: 100%; min-height: 100vh; }

/* Form side (left on register) */
.right-panel { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; gap: 20px; animation: formIn 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s both; }
@keyframes formIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }

/* Branding side (right on register) */
.left-panel {
  display: none; flex-direction: column; justify-content: space-between;
  width: 520px; flex-shrink: 0; padding: 48px 52px;
  border-left: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(195deg, rgba(99,102,241,0.09) 0%, transparent 60%);
  animation: panelIn 0.7s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 1024px) { .left-panel { display: flex; } }
@keyframes panelIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }

.mobile-logo { display: flex; align-items: center; gap: 8px; padding: 32px 32px 0; }
@media (min-width: 1024px) { .mobile-logo { display: none; } }

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

.form-body { padding: 24px 32px 0; display: flex; flex-direction: column; gap: 16px; }

.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; font-weight: 700; color: rgba(203,213,225,0.85); text-transform: uppercase; letter-spacing: 0.08em; }

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

.strength-bar { display: flex; gap: 4px; margin-top: 2px; }
.strength-seg { height: 3px; flex: 1; border-radius: 999px; transition: background 0.3s; }
.strength-empty { background: rgba(255,255,255,0.1); }
.strength-red { background: #ef4444; }
.strength-amber { background: #f59e0b; }
.strength-green { background: #10b981; }
.strength-emerald { background: #34d399; }

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

.field-reveal-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1), max-height 0.3s ease; max-height: 120px; }
.field-reveal-leave-active { transition: opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease; max-height: 120px; }
.field-reveal-enter-from { opacity: 0; transform: translateY(-8px); max-height: 0; }
.field-reveal-leave-to { opacity: 0; transform: translateY(-4px); max-height: 0; }
</style>
