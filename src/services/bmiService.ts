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
  // Create date string in YYYY-MM-DD format
  const paddedMonth = birthMonth.toString().padStart(2, '0');
  const paddedDay = birthDay.toString().padStart(2, '0');
  const dateString = `${birthYear}-${paddedMonth}-${paddedDay}`;
  
  const birthDate = new Date(dateString);
  const today = new Date();
  
  // Validate the date
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid date:', dateString);
    return 0;
  }
  
  // Set both dates to midnight to get accurate day difference
  birthDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const ageInMilliseconds = today.getTime() - birthDate.getTime();
  const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
  
  console.log('Birth Date String:', dateString);
  console.log('Parsed Birth Date:', birthDate.toISOString());
  console.log('Today:', today.toISOString());
  console.log('Age in milliseconds:', ageInMilliseconds);
  console.log('Age in days:', ageInDays);
  
  return ageInDays;
};

export const findBMIRanges = (birthYear: number, birthMonth: number, birthDay: number, sex: string, matrix: MatrixEntry[]) => {
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay);
  console.log('Age in days:', ageInDays);

  // Find the closest age entry in the matrix for the given sex
  const entry = matrix
    .filter(entry => entry.sex === sex)
    .reduce((prev, curr) => {
      return Math.abs(curr['age.d'] - ageInDays) < Math.abs(prev['age.d'] - ageInDays) ? curr : prev;
    });

  console.log('Selected matrix entry:', entry);

  return {
    cent2: entry.cent2,
    cent91: entry.cent91,
    cent98: entry.cent98,
    cent99_6: entry['cent99.6']
  };
};

export const getBMICategory = (bmi: number, birthYear: number, birthMonth: number, birthDay: number, sex: string, matrix: MatrixEntry[], lang: 'zh' | 'en'): string => {
  const ranges = findBMIRanges(birthYear, birthMonth, birthDay, sex, matrix);
  console.log('BMI Ranges:', ranges);
  
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay);
  const ageInYears = ageInDays / 365.25; // Using 365.25 to account for leap years
  console.log('Age in years:', ageInYears);
  console.log('Current BMI:', bmi);

  if (bmi < ranges.cent2) {
    console.log('Category: Underweight');
    return lang === 'zh' ? '體重過輕' : 'Underweight';
  }
  
  if (ageInYears <= 0.2) {
    if (bmi > ranges.cent99_6) {
      console.log('Category: Obese (age <= 0.2)');
      return lang === 'zh' ? '肥胖' : 'Obese';
    }
    if (bmi > ranges.cent98 && bmi <= ranges.cent99_6) {
      console.log('Category: Overweight (age <= 0.2)');
      return lang === 'zh' ? '過重' : 'Overweight';
    }
  } else {
    if (bmi > ranges.cent98) {
      console.log('Category: Obese (age > 0.2)');
      return lang === 'zh' ? '肥胖' : 'Obese';
    }
    if (bmi > ranges.cent91 && bmi <= ranges.cent98) {
      console.log('Category: Overweight (age > 0.2)');
      return lang === 'zh' ? '過重' : 'Overweight';
    }
  }
  
  console.log('Category: Normal');
  return lang === 'zh' ? '正常' : 'Normal';
}; 