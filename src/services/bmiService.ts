interface MatrixEntry {
  var: string;
  age: number;
  sex: string;
  cent0_4: number;
  cent2: number;
  cent9: number;
  cent25: number;
  cent50: number;
  cent75: number;
  cent91: number;
  cent98: number;
  cent99_6: number;
}

export const findBMIRanges = (age: number, sex: string, matrix: MatrixEntry[]) => {
  // Find the closest age entry in the matrix for the given sex
  const entry = matrix
    .filter(entry => entry.sex === sex)
    .reduce((prev, curr) => {
      return Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev;
    });

  return {
    cent2: entry.cent2,
    cent91: entry.cent91,
    cent98: entry.cent98,
    cent99_6: entry.cent99_6
  };
};

export const getBMICategory = (bmi: number, age: number, sex: string, matrix: MatrixEntry[], lang: 'zh' | 'en'): string => {
  const ranges = findBMIRanges(age, sex, matrix);
  
  // Underweight condition is same for all ages
  if (bmi < ranges.cent2) {
    return lang === 'zh' ? '體重過輕' : 'Underweight';
  }
  
  // For children age <= 0.2
  if (age <= 0.2) {
    if (bmi > ranges.cent99_6) {
      return lang === 'zh' ? '肥胖' : 'Obese';
    }
    if (bmi > ranges.cent98 && bmi <= ranges.cent99_6) {
      return lang === 'zh' ? '過重' : 'Overweight';
    }
  } 
  // For children age > 0.2
  else {
    if (bmi > ranges.cent98) {
      return lang === 'zh' ? '肥胖' : 'Obese';
    }
    if (bmi > ranges.cent91 && bmi <= ranges.cent98) {
      return lang === 'zh' ? '過重' : 'Overweight';
    }
  }
  
  // If none of the above conditions are met, the child has normal weight
  return lang === 'zh' ? '正常' : 'Normal';
}; 