export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    title: '兒童體重計算器',
    birthDate: '出生日期',
    year: '年',
    month: '月',
    day: '日',
    height: '身高（厘米）',
    weight: '體重（公斤）',
    sex: '性別',
    selectSex: '請選擇',
    female: '女',
    male: '男',
    calculate: '計算結果',
    results: '計算結果',
    age: '年齡',
    years: '歲',
    bmiLabel: 'BMI',
    weightStatus: '體重狀況',
    underweight: '體重過輕',
    normal: '正常',
    overweight: '過重',
    obese: '肥胖',
    switchLang: 'Switch to English',
    invalidNumber: '請輸入有效數字',
    heightTooLow: '身高不能少於 0.5 米',
    heightTooHigh: '身高不能超過 2.5 米',
    weightTooLow: '體重不能少於 2 公斤',
    weightTooHigh: '體重不能超過 200 公斤',
    dataSource: '資料來源：香港衛生署 2020年兒童生長曲線',
    shareLink: '分享連結',
    bulkProcessing: '批量數據處理',
    uploadCSV: '上傳 CSV 文件',
    csvFormat: 'CSV 格式：出生年份,出生月份,出生日期,身高(厘米),體重(公斤),性別(M/F)',
    downloadResults: '下載結果',
    howToUse: '教學',
    bulkProcessingInstructions: '請準備包含以下列的 CSV 文件：',
    bulkProcessingNotes: '注意事項：',
    bulkProcessingNote1: '第一行必須是標題行，包含列名',
    bulkProcessingNote2: '性別：使用 "M" 表示男性，"F" 表示女性',
    bulkProcessingNote3: '出生年份、月份、日期：使用數字（例如：2015、8、15）',
    bulkProcessingNote4: '身高：以厘米為單位（例如：120）',
    bulkProcessingNote5: '體重：以公斤為單位（例如：25.5）',
    bulkProcessingExample: '示例：',
    csvExample: `sex,birthYear,birthMonth,birthDay,height,weight
M,2015,8,15,120,25.5
F,2016,12,3,110,20.2`,
  },
  en: {
    title: 'Child BMI Calculator',
    birthDate: 'Birth Date',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    height: 'Height (m)',
    weight: 'Weight (kg)',
    sex: 'Sex',
    selectSex: 'Select',
    female: 'Female',
    male: 'Male',
    calculate: 'Calculate',
    results: 'Results',
    age: 'Age',
    years: 'years',
    bmiLabel: 'BMI',
    weightStatus: 'Weight Status',
    underweight: 'Underweight',
    normal: 'Normal',
    overweight: 'Overweight',
    obese: 'Obese',
    switchLang: '切換至中文',
    invalidNumber: 'Please enter a valid number',
    heightTooLow: 'Height cannot be less than 0.5m',
    heightTooHigh: 'Height cannot exceed 2.5m',
    weightTooLow: 'Weight cannot be less than 2kg',
    weightTooHigh: 'Weight cannot exceed 200kg',
    dataSource: 'Data Source: Department of Health Hong Kong 2020 Growth Charts',
    heightCmEn: 'Height (cm)',
    shareLink: 'Share Link',
    bulkProcessing: 'Bulk Data Processing',
    uploadCSV: 'Upload CSV File',
    csvFormat: 'CSV Format: birthYear,birthMonth,birthDay,height(cm),weight(kg),sex(M/F)',
    downloadResults: 'Download Results',
    howToUse: 'How to Use',
    bulkProcessingInstructions: 'Prepare your CSV file with the following columns:',
    bulkProcessingNotes: 'Notes:',
    bulkProcessingNote1: 'The first row must be the header row with column names',
    bulkProcessingNote2: 'sex: Use "M" for male or "F" for female',
    bulkProcessingNote3: 'birthYear, birthMonth, birthDay: Use numbers (e.g., 2015, 8, 15)',
    bulkProcessingNote4: 'height: Height in centimeters (e.g., 120)',
    bulkProcessingNote5: 'weight: Weight in kilograms (e.g., 25.5)',
    bulkProcessingExample: 'Example:',
    csvExample: `sex,birthYear,birthMonth,birthDay,height,weight
M,2015,8,15,120,25.5
F,2016,12,3,110,20.2`,
  },
} as const; 