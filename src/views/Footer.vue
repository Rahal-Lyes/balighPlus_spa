<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <!-- ── Top : brand + liens ── -->
      <div class="app-footer__top">
        <div class="app-footer__brand">
          <div class="app-footer__icon-wrap" aria-hidden="true">🏘️</div>
          <div>
            <strong class="app-footer__name">بلّغ+</strong>
            <p class="app-footer__tagline">{{ t("footer") }}</p>
          </div>
        </div>

        <nav class="app-footer__nav" aria-label="navigation du pied de page">
          <RouterLink class="app-footer__link" to="/">{{
            t("nav_home")
          }}</RouterLink>
          <RouterLink class="app-footer__link" to="/reports">{{
            t("nav_reports")
          }}</RouterLink>
          <RouterLink class="app-footer__link" to="/map">{{
            t("nav_map")
          }}</RouterLink>
          <RouterLink class="app-footer__link" to="/new">{{
            t("nav_new")
          }}</RouterLink>
        </nav>
      </div>

      <!-- ── Bottom : copyright + badge ── -->
      <div class="app-footer__bottom">
        <span class="app-footer__copy">© {{ year }} — بلّغ+</span>
        <span class="app-footer__status" aria-live="polite">
          <span class="app-footer__dot" aria-hidden="true" />
          {{ t("footer_status") }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "@/composables/useI18n";

const { t } = useI18n();
console.log(t("footer_status"));
const year = "2025/2026";
</script>

<style scoped>
.app-footer {
  width: 100%;
  flex-shrink: 0;
  background: var(--color-footer-bg, #f9fafb);
  border-top: 0.5px solid var(--color-border, #e5e7eb);
  padding: 2rem 1.5rem 1.5rem;
}

.app-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Top ── */
.app-footer__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

/* ── Brand ── */
.app-footer__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.app-footer__icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-brand-light, #eff6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
  line-height: 1;
}

.app-footer__name {
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-footer-brand, #111827);
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.app-footer__tagline {
  margin: 3px 0 0;
  font-size: 0.78rem;
  color: var(--color-footer-muted, #9ca3af);
  line-height: 1.3;
}

/* ── Nav ── */
.app-footer__nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.app-footer__link {
  font-size: 0.8125rem;
  color: var(--color-footer-text, #6b7280);
  text-decoration: none;
  transition: color 0.15s;
}

.app-footer__link:hover,
.app-footer__link.router-link-active {
  color: var(--color-footer-brand, #111827);
}

/* ── Bottom ── */
.app-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 0.5px solid var(--color-border, #e5e7eb);
}

.app-footer__copy {
  font-size: 0.75rem;
  color: var(--color-footer-muted, #9ca3af);
  white-space: nowrap;
}

/* ── Status badge ── */
.app-footer__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--color-success-light, #f0fdf4);
  color: var(--color-success, #16a34a);
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.app-footer__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success, #16a34a);
  flex-shrink: 0;
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* ── Mobile ── */
@media (max-width: 580px) {
  .app-footer__top {
    flex-direction: column;
  }

  .app-footer__nav {
    gap: 1rem;
  }

  .app-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
