export const TOPICS = [
  { id: "healthcare", label: "Healthcare", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { id: "education", label: "Education", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { id: "defense", label: "Defense & Security", color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200" },
  { id: "immigration", label: "Immigration", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  { id: "climate", label: "Climate & Environment", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { id: "economy", label: "Economy & Jobs", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { id: "justice", label: "Justice & Civil Rights", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { id: "infrastructure", label: "Infrastructure", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { id: "technology", label: "Technology & Privacy", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
  { id: "foreign_policy", label: "Foreign Policy", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  { id: "budget", label: "Budget & Taxation", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  { id: "housing", label: "Housing", color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" },
] as const;

export const SOURCE_TYPES = {
  user_submitted: { label: "User Submitted", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: "User" },
  youtube: { label: "YouTube", color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200", icon: "Youtube" },
  congress: { label: "U.S. Congress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: "Landmark" },
  youtube_gov: { label: "Official Gov Channel", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: "Youtube" },
  city_council: { label: "City Council", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: "Building2" },
} as const;

export const PROCESSING_STATUSES = {
  pending: { label: "Pending", color: "text-yellow-600" },
  processing: { label: "Processing", color: "text-blue-600" },
  completed: { label: "Completed", color: "text-green-600" },
  failed: { label: "Failed", color: "text-red-600" },
} as const;

export const LOCAL_STORAGE_KEYS = {
  RECENTLY_VIEWED: "openfloor:v1:recentlyViewed",
  DRAFT_COMMENT: "openfloor:v1:draftComment",
  UI_PREFERENCES: "openfloor:v1:uiPreferences",
  FILTER_STATE: "openfloor:v1:filterState",
  COLLAPSED_COMMENTS: "openfloor:v1:collapsedComments",
  ONBOARDING: "openfloor:v1:onboarding",
} as const;

export const PAGE_SIZE = 20;
