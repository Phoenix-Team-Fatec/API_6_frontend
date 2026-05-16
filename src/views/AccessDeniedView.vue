<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <section class="card p-8 max-w-xl text-center">
      <div class="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v3m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-slate-900">Acesso restrito</h1>
      <p class="text-sm text-slate-500 mt-2">
        Seu perfil atual nao tem permissao para abrir esta area. No backend real, essa mesma regra deve ser validada pelo token e pela API.
      </p>
      <RouterLink to="/rules" class="btn-primary mt-6">
        Voltar para regras
      </RouterLink>
    </section>
  </div>
</template>
