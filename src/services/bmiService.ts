interface MatrixEntry {
  var: string;
  'age.d': number;
  sex: string;
  'cent0.4': number;
  cent2: number;
  cent91: number;
  cent98: number;
  'cent99.6': number;
}

const calculateAgeInDays = (birthYear: number, birthMonth: number, birthDay: number): number => {
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay); // Month is 0-indexed
  const today = new Date();
  const ageInMilliseconds = today.getTime() - birthDate.getTime();
  return Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

export const findBMIRanges = (birthYear: number, birthMonth: number, birthDay: number, sex: string, matrix: MatrixEntry[]) => {
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay);

  // Find the closest age entry in the matrix for the given sex
  const entry = matrix
    .filter(entry => entry.sex === sex)
    .reduce((prev, curr) => {
      return Math.abs(curr['age.d'] - ageInDays) < Math.abs(prev['age.d'] - ageInDays) ? curr : prev;
    });

  return {
    cent2: entry.cent2,
    cent91: entry.cent91,
    cent98: entry.cent98,
    cent99_6: entry['cent99.6']
  };
};

export const getBMICategory = (bmi: number, birthYear: number, birthMonth: number, birthDay: number, sex: string, matrix: MatrixEntry[], lang: 'zh' | 'en'): string => {
  const ranges = findBMIRanges(birthYear, birthMonth, birthDay, sex, matrix);
  
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay);
  const ageInYears = ageInDays / 365;

  if (bmi < ranges.cent2) {
    return lang === 'zh' ? '體重過輕' : 'Underweight';
  }
  
  if (ageInYears <= 0.2) {
    if (bmi > ranges.cent99_6) {
      return lang === 'zh' ? '肥胖' : 'Obese';
    }
    if (bmi > ranges.cent98 && bmi <= ranges.cent99_6) {
      return lang === 'zh' ? '過重' : 'Overweight';
    }
  } else {
    if (bmi > ranges.cent98) {
      return lang === 'zh' ? '肥胖' : 'Obese';
    }
    if (bmi > ranges.cent91 && bmi <= ranges.cent98) {
      return lang === 'zh' ? '過重' : 'Overweight';
    }
  }
  
  return lang === 'zh' ? '正常' : 'Normal';
}; 