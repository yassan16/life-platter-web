"use client";

import { useMemo } from "react";
import { generateMockMeals, categoryColors, DayMeals } from "../data/mockMeals";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

function formatDate(dateString: string): { month: number; day: number } {
  const date = new Date(dateString);
  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

export default function RecipeCalendar() {
  const weekMeals = useMemo(() => generateMockMeals(), []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-7 gap-2">
        {/* ヘッダー（曜日） */}
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 font-bold text-sm ${
              index === 5 ? "text-blue-600" : index === 6 ? "text-red-600" : "text-gray-700"
            }`}
          >
            {day}
          </div>
        ))}

        {/* 各日のカード */}
        {weekMeals.map((dayMeal: DayMeals, index: number) => {
          const { month, day } = formatDate(dayMeal.date);
          const today = isToday(dayMeal.date);

          return (
            <div
              key={dayMeal.date}
              className={`min-h-[140px] rounded-lg p-2 transition-all ${
                today
                  ? "bg-amber-50 border-2 border-amber-400 shadow-lg"
                  : "bg-white border border-gray-200 hover:shadow-md"
              }`}
            >
              {/* 日付 */}
              <div
                className={`text-sm font-semibold mb-2 ${
                  today
                    ? "text-amber-600"
                    : index === 5
                    ? "text-blue-600"
                    : index === 6
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {month}/{day}
                {today && (
                  <span className="ml-1 text-xs bg-amber-400 text-white px-1.5 py-0.5 rounded-full">
                    TODAY
                  </span>
                )}
              </div>

              {/* 料理リスト */}
              <div className="space-y-1.5">
                {dayMeal.meals.length > 0 ? (
                  dayMeal.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className={`text-xs px-2 py-1 rounded ${categoryColors[meal.category]}`}
                    >
                      {meal.name}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 italic">未定</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        {Object.entries(categoryColors).map(([category, colorClass]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${colorClass.split(" ")[0]}`}></span>
            <span className="text-xs text-gray-600">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
