import { Calendar, BarChart, Target, Layers, Home, Plus } from "lucide-react";

export const navigarionItems = [
  {
    id: 1,
    href: "/",
    label: "대시보드",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: 2,
    href: "/schedule",
    label: "일정 관리",
    icon: <Calendar className="h-5 w-5" />,
    children: [
      {
        id: 3,
        href: "/schedule",
        label: "일정 등록/확인",
      },
      {
        id: 4,
        href: "/schedule/repeat",
        label: "반복 일정 등록",
      },
    ],
  },
  {
    id: 5,
    href: "/schedule-report",
    label: "리포트",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    id: 6,
    href: "/goals",
    label: "목표 관리",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: 7,
    href: "/categories",
    label: "카테고리 관리",
    icon: <Layers className="h-5 w-5" />,
    children: [
      {
        id: 8,
        href: "/categories",
        label: "카테고리 확인",
      },
      {
        id: 9,
        href: "/categories/change",
        label: "카테고리 일괄 변경",
      },
    ],
  },
];

export const mobileNavigarionItems = [
  {
    id: 1,
    href: "/",
    label: "홈",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: 2,
    href: "/schedule",
    label: "일정",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: 3,
    href: "/schedule",
    label: "추가",
    icon: <Plus color="white" className="h-5 w-5" />,
    primary: true,
    active: false,
  },
  {
    id: 4,
    href: "/goals",
    label: "목표",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: 5,
    href: "/categories",
    label: "카테고리",
    icon: <Layers className="h-5 w-5" />,
  },
];
