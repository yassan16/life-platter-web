export interface Meal {
  id: string;
  name: string;
  category: "和食" | "洋食" | "中華" | "その他";
}

export interface DayMeals {
  date: string; // YYYY-MM-DD format
  meals: Meal[];
}

// 今日の日付を基準にした週のモックデータを生成
export function generateMockMeals(): DayMeals[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const weekMeals: DayMeals[] = [];

  const sampleMeals: { [key: number]: Meal[] } = {
    0: [
      { id: "1", name: "肉じゃが", category: "和食" },
      { id: "2", name: "味噌汁", category: "和食" },
    ],
    1: [
      { id: "3", name: "ハンバーグ", category: "洋食" },
      { id: "4", name: "コーンスープ", category: "洋食" },
    ],
    2: [
      { id: "5", name: "麻婆豆腐", category: "中華" },
      { id: "6", name: "中華スープ", category: "中華" },
    ],
    3: [
      { id: "7", name: "焼き魚定食", category: "和食" },
      { id: "8", name: "ひじきの煮物", category: "和食" },
    ],
    4: [
      { id: "9", name: "カレーライス", category: "洋食" },
      { id: "10", name: "サラダ", category: "洋食" },
    ],
    5: [
      { id: "11", name: "チャーハン", category: "中華" },
      { id: "12", name: "餃子", category: "中華" },
    ],
    6: [], // 日曜は未定
  };

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateString = date.toISOString().split("T")[0];

    weekMeals.push({
      date: dateString,
      meals: sampleMeals[i],
    });
  }

  return weekMeals;
}

export const categoryColors: { [key: string]: string } = {
  "和食": "bg-green-100 text-green-800",
  "洋食": "bg-blue-100 text-blue-800",
  "中華": "bg-red-100 text-red-800",
  "その他": "bg-gray-100 text-gray-800",
};
