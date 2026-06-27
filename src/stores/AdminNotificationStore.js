import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/http";
import API_ENDPOINTS from "@/config/endpoints";
import { useToastStore } from "@/stores/ToastStore";

export const useAdminNotificationStore = defineStore(
  "adminNotifications",
  () => {
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

    const toggleNotifications = () => {
      notifOpen.value = !notifOpen.value;
    };

    const closeNotifications = () => {
      notifOpen.value = false;
    };

    /**
     * Charge les notifications administrateur
     */
    const getNotifications = async () => {
  loading.value = true;
  error.value   = null;
  try {
    const { data } = await api.get(API_ENDPOINTS.adminNotifications);

    if (Array.isArray(data)) {
      notifications.value = data;
      unreadCount.value   = data.filter(n => !n.is_read).length;
    } else {
      notifications.value = data.notifications ?? [];
      unreadCount.value   = data.unread_count   ?? 0;
    }

    return data;
  } catch (err) {
  
    error.value = err.response?.data?.detail ?? "Erreur chargement notifications.";
    toast.ToastError(error.value);
    throw err;
  } finally {
    loading.value = false;
  }
};



  const markAllAsRead = async () => {
    try {
      await api.post(API_ENDPOINTS.adminNotificationsMarkRead);
      unreadCount.value = 0;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

    /**
     * Marquer une notification comme lue
     */
const markAsRead = async (notificationId) => {
  try {
    await api.post(API_ENDPOINTS.adminNotificationsMarkRead, {
      notification_id: notificationId,
    });
    const n = notifications.value.find(x => x.id === notificationId);
    if (n && !n.is_read) {
      n.is_read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

    /**
     * Charger uniquement le compteur
     */
    const fetchUnreadCount = async () => {
      try {
        const { data } = await api.get(
          API_ENDPOINTS.adminNotificationsUnreadCount
        );

        unreadCount.value = data.unread_count ?? 0;
      } catch (err) {
        console.error(err);
      }
    };

    /**
     * Reset
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
      fetchUnreadCount,
       markAllAsRead,

      // Utils
      $reset,
    };
  }
);