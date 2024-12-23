const fs = require('fs');
const csv = require('csv-parse/sync');

// 读取 CSV 文件
const csvContent = fs.readFileSync('../SpringSecondHand-backend/data/majors.csv', 'utf-8');

// 解析 CSV
const records = csv.parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// 生成数据结构
const majors = records.map((record, index) => ({
  id: index + 1,  // 使用自增 ID
  code: record['校内代码'],
  name: record['校内专业名称']
}));

// 生成 TypeScript 代码
const tsContent = `export const MAJORS = ${JSON.stringify(majors, null, 2)} as const;

export type MajorCode = typeof MAJORS[number]["code"];
`;

// 写入文件
fs.writeFileSync('../SpringSecondHand-frontend/src/constants/majors.ts', tsContent);

console.log('Majors data has been generated successfully!'); 