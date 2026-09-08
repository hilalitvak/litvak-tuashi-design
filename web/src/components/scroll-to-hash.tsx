"use client";

import { useEffect } from "react";

/**
 * Next מטפל בעוגן (#projects) רק כשהלחיצה קורית בתוך אותו עמוד. בניווט
 * מעמוד אחר — למשל "פרויקטים" בסרגל כשאנחנו באודות — הוא טוען את עמוד
 * הבית אבל משאיר את הגלילה למעלה. הרכיב הזה משלים את החלק החסר.
 *
 * scroll-margin-top על הסקשן עצמו הוא שמונע מהכותרת הקבועה לכסות אותו.
 */
export function ScrollToHash() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    // בלי behavior מפורש: ה-CSS מחליט, וכך הכלל של
    // prefers-reduced-motion בגיליון הסגנונות ממשיך לחול.
    // פריים אחד של השהיה כדי שהפריסה תתייצב לפני המדידה.
    const frame = requestAnimationFrame(() => target.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
