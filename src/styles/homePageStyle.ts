import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudHail,
} from "lucide-react";

export const dustGradeClassMap: { [key: number]: string } = {
  1: "bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800 ",
  2: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-800",
  3: "bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-800",
  4: "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-800",
};

export const dustGradeLabelMap: { [key: number]: string } = {
  1: "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-100 dark:border-blue-800",
  2: "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800",
  3: "bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-100 dark:border-orange-800",
  4: "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-100 dark:border-red-800",
};

export const weatherStates = [
  {
    id: "sunny",
    name: "맑음",
    icon: Sun,
    gradient:
      "bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 dark:from-yellow-900 dark:via-orange-900 dark:to-red-900",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
    iconBg: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    id: "partly_cloudy",
    name: "구름 많음",
    icon: Cloud,
    gradient:
      "bg-gradient-to-r from-blue-100 via-sky-100 to-gray-100 dark:from-blue-900 dark:via-sky-900 dark:to-gray-900",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "cloudy",
    name: "흐림",
    icon: Cloud,
    gradient:
      "bg-gradient-to-r from-gray-200 via-slate-200 to-zinc-200 dark:from-gray-800 dark:via-slate-800 dark:to-zinc-800",
    bgColor: "bg-gray-50 dark:bg-gray-900/10",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  {
    id: "rainy",
    name: "비",
    icon: CloudRain,
    gradient:
      "bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-300 dark:border-blue-800",
  },
  {
    id: "snow",
    name: "눈",
    icon: CloudSnow,
    gradient:
      "bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/10",
    iconBg: "bg-cyan-100 dark:bg-cyan-900",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  {
    id: "drizzle",
    name: "빗방울",
    icon: CloudHail,
    gradient:
      "bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 dark:from-slate-800 dark:via-blue-800 dark:to-indigo-800",
    bgColor: "bg-slate-50 dark:bg-slate-900/10",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-600 dark:text-slate-400",
    borderColor: "border-slate-200 dark:border-slate-700",
  },
];
