// composables/useI18n.js — Système de traduction AR / FR / EN
import { ref, computed } from "vue";

const lang = ref(localStorage.getItem("lang") || "ar");

export const TRANSLATIONS = {
  // NAV
  nav_home: { ar: "الرئيسية", fr: "Accueil", en: "Home" },
  nav_reports: { ar: "البلاغات", fr: "Signalements", en: "Reports" },
  nav_map: { ar: "الخريطة", fr: "Carte", en: "Map" },
  nav_new: { ar: "بلاغ جديد", fr: "Nouveau signalement", en: "New Report" },
  nav_mine: { ar: "بلاغاتي", fr: "Mes signalements", en: "My Reports" },
  nav_login: { ar: "دخول", fr: "Connexion", en: "Login" },
  nav_register: { ar: "تسجيل", fr: "S'inscrire", en: "Register" },
  nav_panel: { ar: "لوحة التحكم", fr: "Tableau de bord", en: "Dashboard" },
  nav_logout: { ar: "خروج", fr: "Déconnexion", en: "Logout" },
    footer_status: {
    ar: "🟢 الخدمة نشطة",
    fr: "Service actif",
    en: "Service active",
  },
  // HERO
  hero_title: {
    ar: "منصة الإبلاغ الذكي عن مشاكل الأحياء",
    fr: "Plateforme Intelligente de Signalement Urbain",
    en: "Smart Neighborhood Issue Reporting Platform",
  },
  hero_sub: {
    ar: "أبلغ عن مشكلة في حيّك بضغطة واحدة وتابع حلّها في الوقت الحقيقي",
    fr: "Signalez un problème dans votre quartier en un clic et suivez sa résolution en temps réel",
    en: "Report a problem in your neighborhood in one click and track its resolution in real time",
  },
  hero_btn_new: {
    ar: "🚀 أضف بلاغاً الآن",
    fr: "🚀 Ajouter un signalement",
    en: "🚀 Add a Report Now",
  },
  hero_btn_mine: {
    ar: "📁 بلاغاتي",
    fr: "📁 Mes signalements",
    en: "📁 My Reports",
  },
  hero_btn_reg: {
    ar: "📝 سجّل الآن — مجاناً",
    fr: "📝 S'inscrire — Gratuit",
    en: "📝 Sign Up — Free",
  },
  hero_btn_view: {
    ar: " عرض البلاغات",
    fr: " Voir les signalements",
    en: " Browse Reports",
  },
  // STATS
  stat_total: {
    ar: "إجمالي البلاغات",
    fr: "Total signalements",
    en: "Total Reports",
  },
  stat_pending: { ar: "قيد الانتظار", fr: "En attente", en: "Pending" },
  stat_process: { ar: "قيد المعالجة", fr: "En traitement", en: "In Progress" },
  stat_resolved: { ar: "تم الحل", fr: "Résolus", en: "Resolved" },
  // HOW IT WORKS
  how_title: {
    ar: "كيف تعمل المنصة؟",
    fr: "Comment ça marche ?",
    en: "How It Works",
  },
  how1_t: {
    ar: "سجّل حسابك",
    fr: "Créez votre compte",
    en: "Create Your Account",
  },
  how1_d: {
    ar: "أنشئ حساباً مجانياً خلال ثوانٍ بالبريد وكلمة المرور",
    fr: "Créez un compte gratuit en quelques secondes",
    en: "Create a free account in seconds with your email and password",
  },
  how2_t: {
    ar: "أرسل بلاغاً",
    fr: "Envoyez un signalement",
    en: "Submit a Report",
  },
  how2_d: {
    ar: "صوّر المشكلة وحدد موقعها على الخريطة وأرسل",
    fr: "Photographiez le problème, localisez-le et envoyez",
    en: "Photo the problem, pin it on the map and submit",
  },
  how3_t: {
    ar: "تابع وتلقَّ إشعارات",
    fr: "Suivez & recevez des notifications",
    en: "Track & Get Notified",
  },
  how3_d: {
    ar: "ستصلك إشعارات داخلية عند أي تحديث لبلاغك",
    fr: "Recevez des notifications à chaque mise à jour",
    en: "Receive in-app notifications on every update to your report",
  },
  how4_t: {
    ar: "البلدية تتدخل",
    fr: "La mairie intervient",
    en: "Municipality Acts",
  },
  how4_d: {
    ar: "يصل البلاغ مع الصور والموقع للجهة المعنية",
    fr: "Le signalement avec photos et localisation est transmis aux autorités",
    en: "The report with photos and location is forwarded to the relevant authority",
  },
  // CATEGORIES
  cat_title: {
    ar: "أنواع البلاغات",
    fr: "Types de signalements",
    en: "Report Types",
  },
  cat_road: {
    ar: "حفر وطرق",
    fr: "Routes & nids-de-poule",
    en: "Roads & Potholes",
  },
  cat_lighting: {
    ar: "إنارة معطلة",
    fr: "Éclairage défaillant",
    en: "Street Lighting",
  },
  cat_waste: { ar: "نفايات", fr: "Déchets", en: "Waste & Garbage" },
  cat_water: { ar: "تسرب مياه", fr: "Fuite d'eau", en: "Water Leak" },
  cat_other: { ar: "أخرى", fr: "Autre", en: "Other" },
  // STATUSES
  st_pending: { ar: "قيد الانتظار", fr: "En attente", en: "Pending" },
  st_processing: { ar: "قيد المعالجة", fr: "En traitement", en: "In Progress" },
  st_resolved: { ar: "محلولة", fr: "Résolue", en: "Resolved" },
  // REPORTS PAGE
  rp_title: {
    ar: "جميع البلاغات",
    fr: "Tous les signalements",
    en: "All Reports",
  },
  rp_sub: {
    ar: "تصفح البلاغات وصوّت على المشاكل التي تواجهها",
    fr: "Parcourez les signalements et votez pour les problèmes que vous rencontrez",
    en: "Browse reports and vote for problems you also face",
  },
  rp_search: { ar: "ابحث...", fr: "Rechercher...", en: "Search..." },
  rp_all_st: { ar: "كل الحالات", fr: "Tous les statuts", en: "All Statuses" },
  rp_all_cat: { ar: "كل الأنواع", fr: "Tous les types", en: "All Types" },
  rp_filter: { ar: "تصفية", fr: "Filtrer", en: "Filter" },
  rp_reset: { ar: "إعادة", fr: "Réinitialiser", en: "Reset" },
  rp_details: { ar: "تفاصيل", fr: "Détails", en: "Details" },
  rp_voted: {
    ar: "✅ صوّتت بالفعل",
    fr: "✅ Déjà voté",
    en: "✅ Already Voted",
  },
  rp_vote: {
    ar: "👍 أواجه نفس المشكلة",
    fr: "👍 Je rencontre ce problème",
    en: "👍 I Face This Too",
  },
  rp_empty: {
    ar: "لا توجد بلاغات مطابقة",
    fr: "Aucun signalement trouvé",
    en: "No reports found",
  },
  rp_view_map: {
    ar: "🗺️ عرض الموقع على الخريطة",
    fr: "🗺️ Voir sur la carte",
    en: "🗺️ View on Map",
  },
  // NEW REPORT
  nr_title: {
    ar: "إضافة بلاغ جديد",
    fr: "Ajouter un signalement",
    en: "Add New Report",
  },
  nr_sub: {
    ar: "أخبرنا عن المشكلة وسنوصلها للجهة المعنية",
    fr: "Décrivez le problème, nous le transmettrons aux autorités",
    en: "Describe the problem and we will forward it to the right authority",
  },
  nr_back: { ar: "← العودة", fr: "← Retour", en: "← Back" },
  nr_f_title: {
    ar: "📝 عنوان المشكلة *",
    fr: "📝 Titre du problème *",
    en: "📝 Issue Title *",
  },
  nr_ph_title: {
    ar: "مثال: حفرة كبيرة في الطريق",
    fr: "Ex: Grande nid-de-poule sur la route",
    en: "E.g: Large pothole on the main road",
  },
  nr_f_cat: {
    ar: "🏷️ نوع المشكلة *",
    fr: "🏷️ Type de problème *",
    en: "🏷️ Issue Type *",
  },
  nr_f_wilaya: { ar: "🗺️ الولاية *", fr: "🗺️ Wilaya *", en: "🗺️ Wilaya *" },
  nr_f_commune: {
    ar: "🏘️ البلدية / الحي *",
    fr: "🏘️ Commune / Quartier *",
    en: "🏘️ Commune / District *",
  },
  nr_ph_commune: {
    ar: "باب الوادي...",
    fr: "Bab El Oued...",
    en: "Bab El Oued...",
  },
  nr_f_desc: {
    ar: "📋 وصف المشكلة *",
    fr: "📋 Description du problème *",
    en: "📋 Problem Description *",
  },
  nr_ph_desc: {
    ar: "اشرح المشكلة: مكانها، مدتها، خطورتها...",
    fr: "Décrivez le problème: lieu, durée, gravité...",
    en: "Describe the issue: location, duration, severity...",
  },
  nr_f_map: {
    ar: "📍 الموقع على الخريطة",
    fr: "📍 Localisation sur la carte",
    en: "📍 Location on Map",
  },
  nr_optional: { ar: "اختياري", fr: "Optionnel", en: "Optional" },
  nr_gps: {
    ar: "📡 موقعي الحالي",
    fr: "📡 Ma position GPS",
    en: "📡 Use My GPS",
  },
  nr_map_hint: {
    ar: "أو اضغط على الخريطة",
    fr: "Ou cliquez sur la carte",
    en: "Or click on the map",
  },
  nr_map_none: {
    ar: "🗺️ لم يُحدَّد موقع بعد — اضغط على الخريطة",
    fr: "🗺️ Aucune position — cliquez sur la carte",
    en: "🗺️ No location set — click on the map",
  },
  nr_f_img: { ar: "🖼️ الصور", fr: "🖼️ Photos", en: "🖼️ Photos" },
  nr_img_hint: {
    ar: "حتى 6 صور — اختياري",
    fr: "Jusqu'à 6 photos — Optionnel",
    en: "Up to 6 photos — Optional",
  },
  nr_drop: {
    ar: "اضغط أو اسحب الصور هنا",
    fr: "Cliquez ou déposez des photos ici",
    en: "Click or drag photos here",
  },
  nr_img_types: {
    ar: "JPG · PNG · WEBP — حتى 6 صور",
    fr: "JPG · PNG · WEBP — max 6 photos",
    en: "JPG · PNG · WEBP — max 6 photos",
  },
  nr_submit: {
    ar: "✅ إرسال البلاغ",
    fr: "✅ Envoyer le signalement",
    en: "✅ Submit Report",
  },
  nr_cancel: { ar: "إلغاء", fr: "Annuler", en: "Cancel" },
  // MY REPORTS
  mr_title: { ar: "بلاغاتي", fr: "Mes signalements", en: "My Reports" },
  mr_sub: {
    ar: "جميع البلاغات التي أرسلتها",
    fr: "Tous vos signalements envoyés",
    en: "All your submitted reports",
  },
  mr_new: {
    ar: "➕ بلاغ جديد",
    fr: "➕ Nouveau signalement",
    en: "➕ New Report",
  },
  mr_empty: {
    ar: "لم ترسل أي بلاغ بعد",
    fr: "Aucun signalement envoyé pour le moment",
    en: "No reports submitted yet",
  },
  mr_first: {
    ar: "➕ أرسل أول بلاغ",
    fr: "➕ Envoyer mon premier signalement",
    en: "➕ Send My First Report",
  },
  // DETAIL
  dt_comments: { ar: "💬 التعليقات", fr: "💬 Commentaires", en: "💬 Comments" },
  dt_no_cmt: {
    ar: "لا توجد تعليقات بعد. كن الأول!",
    fr: "Aucun commentaire. Soyez le premier !",
    en: "No comments yet. Be the first!",
  },
  dt_add_cmt: {
    ar: "أضف تعليقاً",
    fr: "Ajouter un commentaire",
    en: "Add a Comment",
  },
  dt_official: {
    ar: "رد رسمي 🛡️",
    fr: "Réponse officielle 🛡️",
    en: "Official Reply 🛡️",
  },
  dt_ph_cmt: {
    ar: "اكتب تعليقك هنا...",
    fr: "Écrivez votre commentaire...",
    en: "Write your comment here...",
  },
  dt_send_cmt: {
    ar: "💬 إرسال التعليق",
    fr: "💬 Envoyer",
    en: "💬 Post Comment",
  },
  dt_login_cmt: { ar: "سجّل الدخول", fr: "Connectez-vous", en: "Log in" },
  dt_login_cmt2: {
    ar: "للإضافة تعليق",
    fr: "pour commenter",
    en: "to add a comment",
  },
  dt_votes: { ar: "أصوات", fr: "votes", en: "votes" },
  dt_cmts: { ar: "تعليقات", fr: "commentaires", en: "comments" },
  dt_back: {
    ar: "← العودة للبلاغات",
    fr: "← Retour aux signalements",
    en: "← Back to Reports",
  },
  dt_vote_btn: {
    ar: "👍 أواجه نفس المشكلة",
    fr: "👍 Je rencontre ce problème",
    en: "👍 I Face This Too",
  },
  dt_voted_btn: {
    ar: "✅ صوّتت بالفعل",
    fr: "✅ Déjà voté",
    en: "✅ Already Voted",
  },
  // MAP
  map_title: {
    ar: "🗺️ خريطة البلاغات",
    fr: "🗺️ Carte des signalements",
    en: "🗺️ Reports Map",
  },
  map_sub: {
    ar: "عرض جميع البلاغات على الخريطة",
    fr: "Affichage de tous les signalements sur la carte",
    en: "All reports displayed on the interactive map",
  },
  map_located: {
    ar: "بلاغ بموقع محدد",
    fr: "signalement(s) localisé(s)",
    en: "located report(s)",
  },
  // PROFILE
  pf_title: { ar: "👤 الملف الشخصي", fr: "👤 Profil", en: "👤 My Profile" },
  pf_since: { ar: "عضو منذ", fr: "Membre depuis", en: "Member since" },
  pf_my_rep: { ar: "بلاغاتي", fr: "Mes signalements", en: "My Reports" },
  pf_resolved: { ar: "تم حلها", fr: "Résolus", en: "Resolved" },
  pf_chg_pass: {
    ar: "🔒 تغيير كلمة المرور",
    fr: "🔒 Changer le mot de passe",
    en: "🔒 Change Password",
  },
  pf_old_pass: {
    ar: "كلمة المرور الحالية",
    fr: "Mot de passe actuel",
    en: "Current Password",
  },
  pf_new_pass: {
    ar: "كلمة المرور الجديدة",
    fr: "Nouveau mot de passe",
    en: "New Password",
  },
  pf_new_pass2: {
    ar: "تأكيد الجديدة",
    fr: "Confirmer le nouveau",
    en: "Confirm New Password",
  },
  pf_save: {
    ar: "🔒 حفظ كلمة المرور",
    fr: "🔒 Enregistrer",
    en: "🔒 Save Password",
  },
  // LOGIN
  lg_title: { ar: "تسجيل الدخول", fr: "Connexion", en: "Sign In" },
  lg_sub: {
    ar: "مرحباً بعودتك إلى بلّغ+",
    fr: "Bon retour sur Balligh+",
    en: "Welcome back to Balligh+",
  },
  lg_email: {
    ar: "البريد الإلكتروني",
    fr: "Adresse e-mail",
    en: "Email Address",
  },
  lg_pass: { ar: "كلمة المرور", fr: "Mot de passe", en: "Password" },
  lg_btn: { ar: "🔑 دخول", fr: "🔑 Se connecter", en: "🔑 Sign In" },
  lg_no_acc: {
    ar: "ليس لديك حساب؟",
    fr: "Pas encore de compte ?",
    en: "Don't have an account?",
  },
  lg_reg_now: { ar: "سجّل الآن", fr: "Inscrivez-vous", en: "Sign up now" },
  lg_need: {
    ar: "يجب تسجيل الدخول لإرسال بلاغ جديد.",
    fr: "Vous devez vous connecter pour envoyer un signalement.",
    en: "You must be logged in to submit a new report.",
  },
  // REGISTER
  rg_title: {
    ar: "إنشاء حساب جديد",
    fr: "Créer un compte",
    en: "Create Account",
  },
  rg_sub: {
    ar: "انضم إلى منصة بلّغ+ مجاناً",
    fr: "Rejoignez la plateforme Balligh+ gratuitement",
    en: "Join Balligh+ for free",
  },
  rg_name: { ar: "الاسم الكامل *", fr: "Nom complet *", en: "Full Name *" },
  rg_email: { ar: "البريد الإلكتروني *", fr: "E-mail *", en: "Email *" },
  rg_pass: { ar: "كلمة المرور *", fr: "Mot de passe *", en: "Password *" },
  rg_pass_hint: {
    ar: "6 أحرف على الأقل",
    fr: "Min. 6 caractères",
    en: "At least 6 characters",
  },
  rg_pass2: {
    ar: "تأكيد كلمة المرور *",
    fr: "Confirmer le mot de passe *",
    en: "Confirm Password *",
  },
  rg_btn: {
    ar: "📝 إنشاء الحساب",
    fr: "📝 Créer le compte",
    en: "📝 Create Account",
  },
  rg_have_acc: {
    ar: "لديك حساب؟",
    fr: "Déjà un compte ?",
    en: "Already have an account?",
  },
  rg_login: { ar: "سجّل الدخول", fr: "Se connecter", en: "Sign in" },
  // ADMIN
  adm_title: {
    ar: "🛡️ لوحة تحكم المسؤول",
    fr: "🛡️ Tableau de bord Admin",
    en: "🛡️ Admin Dashboard",
  },
  adm_sub: {
    ar: "إدارة كاملة للمنصة والبلاغات والمستخدمين",
    fr: "Gestion complète de la plateforme",
    en: "Full management of the platform, reports and users",
  },
  adm_users: { ar: "👥 المستخدمون", fr: "👥 Utilisateurs", en: "👥 Users" },
  adm_name: { ar: "الاسم", fr: "Nom", en: "Name" },
  adm_email: { ar: "البريد", fr: "E-mail", en: "Email" },
  adm_joined: { ar: "تاريخ الانضمام", fr: "Date d'inscription", en: "Joined" },
  adm_status: { ar: "الحالة", fr: "Statut", en: "Status" },
  adm_action: { ar: "إجراء", fr: "Action", en: "Action" },
  adm_monthly: {
    ar: "📈 البلاغات حسب الشهر",
    fr: "📈 Signalements par mois",
    en: "📈 Reports by Month",
  },
  adm_by_cat: {
    ar: "🥧 البلاغات حسب النوع",
    fr: "🥧 Signalements par type",
    en: "🥧 Reports by Type",
  },
  adm_rate: {
    ar: "معدل الحل",
    fr: "Taux de résolution",
    en: "Resolution Rate",
  },
  adm_search: { ar: "🔍 ابحث...", fr: "🔍 Rechercher...", en: "🔍 Search..." },
  adm_del_ok: {
    ar: "حذف البلاغ؟",
    fr: "Supprimer ce signalement ?",
    en: "Delete this report?",
  },
  adm_no_rep: {
    ar: "لا توجد بلاغات",
    fr: "Aucun signalement",
    en: "No reports found",
  },
  adm_login_t: { ar: "دخول المسؤول", fr: "Connexion Admin", en: "Admin Login" },
  adm_login_s: {
    ar: "لوحة تحكم مسؤول المنصة",
    fr: "Tableau de bord de la plateforme",
    en: "Platform Admin Dashboard",
  },
  adm_login_btn: { ar: "🛡️ دخول", fr: "🛡️ Connexion", en: "🛡️ Sign In" },
  adm_reports: { ar: "البلاغات", fr: "Signalements", en: "Reports" },
  adm_votes: { ar: "أصوات", fr: "Votes", en: "Votes" },
  adm_cmts: { ar: "تعليقات", fr: "Commentaires", en: "Comments" },
  adm_citizen: { ar: "المواطن", fr: "Citoyen", en: "Citizen" },
  adm_location: { ar: "الموقع", fr: "Localisation", en: "Location" },
  adm_photos: { ar: "صور", fr: "Photos", en: "Photos" },
  // NOTIFICATIONS
  notif_title: {
    ar: "🔔 الإشعارات",
    fr: "🔔 Notifications",
    en: "🔔 Notifications",
  },
  notif_mark: {
    ar: "تحديد الكل كمقروء",
    fr: "Tout marquer comme lu",
    en: "Mark all as read",
  },
  notif_empty: {
    ar: "🔕 لا توجد إشعارات",
    fr: "🔕 Aucune notification",
    en: "🔕 No notifications",
  },
  // MISC
  priority: { ar: "الأولوية", fr: "Priorité", en: "Priority" },
  pri_urgent: { ar: "🔴 عاجل", fr: "🔴 Urgent", en: "🔴 Urgent" },
  pri_normal: { ar: "🟡 عادي", fr: "🟡 Normal", en: "🟡 Normal" },
  pri_low: { ar: "🟢 منخفض", fr: "🟢 Faible", en: "🟢 Low" },
  history: { ar: "📜 سجل التغييرات", fr: "📜 Historique", en: "📜 History" },
  csv_export: {
    ar: "⬇️ تصدير CSV",
    fr: "⬇️ Exporter CSV",
    en: "⬇️ Export CSV",
  },
  ok_sent: {
    ar: "تم إرسال بلاغك بنجاح!",
    fr: "Votre signalement a été envoyé avec succès !",
    en: "Your report was submitted successfully!",
  },
  ok_status: {
    ar: "تم تحديث الحالة.",
    fr: "Statut mis à jour.",
    en: "Status updated.",
  },
  ok_deleted: {
    ar: "تم حذف البلاغ.",
    fr: "Signalement supprimé.",
    en: "Report deleted.",
  },
  ok_pass: {
    ar: "تم تغيير كلمة المرور بنجاح!",
    fr: "Mot de passe modifié avec succès !",
    en: "Password changed successfully!",
  },
  ok_welcome: {
    ar: "🎉 مرحباً بك في منصة بلّغ+! يمكنك الآن إرسال بلاغاتك.",
    fr: "🎉 Bienvenue sur Balligh+ ! Vous pouvez maintenant soumettre vos signalements.",
    en: "🎉 Welcome to Balligh+! You can now submit your reports.",
  },
  cta_title: {
    ar: "جاهز لتحسين حيّك؟",
    fr: "Prêt à améliorer votre quartier ?",
    en: "Ready to Improve Your Neighborhood?",
  },
  cta_sub: {
    ar: "انضم لآلاف المواطنين ويجعل مدينتك أفضل",
    fr: "Rejoignez des milliers de citoyens pour une ville meilleure",
    en: "Join thousands of citizens making their city a better place",
  },
  cta_btn: {
    ar: "انضم الآن مجاناً ←",
    fr: "Rejoindre gratuitement ←",
    en: "Join Free Now ←",
  },
  latest: {
    ar: "آخر البلاغات",
    fr: "Derniers signalements",
    en: "Latest Reports",
  },
  footer: {
    ar: "منصة الإبلاغ الذكي عن مشاكل الأحياء",
    fr: "Plateforme intelligente de signalement urbain",
    en: "Smart Neighborhood Issue Reporting Platform",
  },
  // ERRORS
  err_fields: {
    ar: "يرجى ملء جميع الحقول.",
    fr: "Veuillez remplir tous les champs.",
    en: "Please fill in all required fields.",
  },
  err_mismatch: {
    ar: "كلمتا المرور غير متطابقتين.",
    fr: "Les mots de passe ne correspondent pas.",
    en: "Passwords do not match.",
  },
  err_short: {
    ar: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
    fr: "Mot de passe trop court (min. 6 caractères).",
    en: "Password must be at least 6 characters.",
  },
  gps_no: {
    ar: "GPS غير مدعوم",
    fr: "GPS non supporté",
    en: "GPS not supported",
  },
  gps_finding: {
    ar: "جاري التحديد...",
    fr: "Localisation en cours...",
    en: "Locating...",
  },
  gps_ok: {
    ar: "✅ تم تحديد موقعك!",
    fr: "✅ Position trouvée !",
    en: "✅ Location found!",
  },
  gps_err: {
    ar: "❌ تعذّر تحديد الموقع",
    fr: "❌ Impossible de localiser",
    en: "❌ Could not get location",
  },
  toast_read: {
    ar: "✅ تم تحديد الكل كمقروء",
    fr: "✅ Tout marqué comme lu",
    en: "✅ All marked as read",
  },
  
  citizens: { ar: "مواطن", fr: "Citoyens", en: "Citizens" },

  // À ajouter dans ton fichier de traductions

nr_step_info:     { fr: "Informations",  en: "Information",  ar: "المعلومات"   },
nr_step_location: { fr: "Localisation",  en: "Location",     ar: "الموقع"      },
nr_step_photos:   { fr: "Photos",        en: "Photos",       ar: "الصور"       },
nr_step_recap:    { fr: "Récapitulatif", en: "Summary",      ar: "الملخص"      },
nr_f_priority:    { fr: "Priorité",      en: "Priority",     ar: "الأولوية"    },

};

export function useI18n() {
  const setLang = (l) => {
    lang.value = l;
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const t = (key) =>
    TRANSLATIONS[key]?.[lang.value] ?? TRANSLATIONS[key]?.["ar"] ?? key;

  const isRTL = computed(() => lang.value === "ar");

  return { lang, t, setLang, isRTL };
}
