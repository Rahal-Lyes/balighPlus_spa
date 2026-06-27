// stores/UserNotificationStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/http";
import API_ENDPOINTS from "@/config/endpoints";
import { useToastStore } from "@/stores/ToastStore";

export const useUserNotificationStore = defineStore("userNotifications", () => {
  const toast = useToastStore();

  // =========================
  // STATE
  // =========================

  const notifOpen = ref(false);
  const notifications = ref([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // =========================
  // ACTIONS
  // =========================

  /**
   * Ouvre / ferme le panneau des notifications
   */
  const toggleNotifications = () => {
    notifOpen.value = !notifOpen.value;
  };

  /**
   * Ferme le panneau
   */
  const closeNotifications = () => {
    notifOpen.value = false;
  };

  /**
   * Charge les notifications de l'utilisateur connecté
   */
  const getNotifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get(API_ENDPOINTS.notifications);

      // ✅ L'API retourne directement un tableau
      if (Array.isArray(data)) {
        notifications.value = data;
        unreadCount.value = data.filter((n) => !n.is_read).length;
      } else {
        // Fallback si l'API évolue vers un objet
        notifications.value = data.notifications ?? [];
        unreadCount.value = data.unread_count ?? 0;
      }

      return data;
    } catch (err) {
      console.error("UserNotificationStore:", err);
      error.value =
        err.response?.data?.detail ?? "Erreur chargement notifications.";
      toast.ToastError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Marque une notification comme lue
   */
  const markAsRead = async (notificationId) => {
    try {
      await api.patch(API_ENDPOINTS.notificationRead(notificationId));
      const notification = notifications.value.find(
        (n) => n.id === notificationId,
      );
      if (notification && !notification.is_read) {
        // was !notification.read
        notification.is_read = true; // was notification.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Marque toutes les notifications comme lues
   */
  const markAllAsRead = async () => {
    try {
      await api.post(API_ENDPOINTS.notificationsMarkRead);
      unreadCount.value = 0;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Réinitialise le store
   */
  const $reset = () => {
    notifOpen.value = false;
    notifications.value = [];
    unreadCount.value = 0;
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    notifOpen,
    notifications,
    unreadCount,
    loading,
    error,

    // Actions
    toggleNotifications,
    closeNotifications,
    getNotifications,
    markAsRead,
    markAllAsRead,

    // Utils
    $reset,
  };
});
