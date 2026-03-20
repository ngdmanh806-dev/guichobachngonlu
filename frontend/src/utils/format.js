export const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);

export const formatGPA = (gpa) => parseFloat(gpa).toFixed(2);

export const formatPercent = (decimal) => `${(decimal * 100).toFixed(1)}%`;
