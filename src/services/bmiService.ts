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

export const calculateAgeInDays = (birthYear: number, birthMonth: number, birthDay: number, assessmentDate: string): number => {
  // Create date string in YYYY-MM-DD format
  const paddedMonth = birthMonth.toString().padStart(2, '0');
  const paddedDay = birthDay.toString().padStart(2, '0');
  const dateString = `${birthYear}-${paddedMonth}-${paddedDay}`;
  
  const birthDate = new Date(dateString);
  const assessment = new Date(assessmentDate);
  
  // Validate the dates
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid birth date:', dateString);
    return 0;
  }
  if (isNaN(assessment.getTime())) {
    console.error('Invalid assessment date:', assessmentDate);
    return 0;
  }
  
  // Set both dates to midnight to get accurate day difference
  birthDate.setHours(0, 0, 0, 0);
  assessment.setHours(0, 0, 0, 0);
  
  const ageInMilliseconds = assessment.getTime() - birthDate.getTime();
  const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
  
  console.log('Birth Date String:', dateString);
  console.log('Assessment Date:', assessment.toISOString());
  console.log('Age in milliseconds:', ageInMilliseconds);
  console.log('Age in days:', ageInDays);
  
  return ageInDays;
};

export const calculateAgeInMonths = (birthYear: number, birthMonth: number, birthDay: number, assessmentDate: string): number => {
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay, assessmentDate);
  return Math.floor(ageInDays / 30.44); // Using 30.44 as average days per month
};

export const calculateAgeInYears = (birthYear: number, birthMonth: number, birthDay: number, assessmentDate: string): number => {
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay, assessmentDate);
  return ageInDays / 365.25; // Using 365.25 to account for leap years
};

export const findBMIRanges = (birthYear: number, birthMonth: number, birthDay: number, sex: string, matrix: MatrixEntry[], assessmentDate: string) => {
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay, assessmentDate);
  console.log('Age in days:', ageInDays);

  // Find the closest age entry in the matrix for the given sex
  const entry = matrix
    .filter(entry => entry.sex === sex)
    .reduce((prev, curr) => {
      return Math.abs(curr['age.d'] - ageInDays) < Math.abs(prev['age.d'] - ageInDays) ? curr : prev;
    });

  console.log('Selected matrix entry:', entry);

  return {
    cent0_4: entry['cent0.4'],
    cent2: entry.cent2,
    cent91: entry.cent91,
    cent98: entry.cent98,
    cent99_6: entry['cent99.6']
  };
};

const bmiCategories = {
  underweight: { en: 'Underweight', zh: '過輕' },
  lighterThanNormal: { en: 'Lighter than normal', zh: '偏瘦' },
  normal: { en: 'Normal', zh: '適中' },
  overweight: { en: 'Overweight', zh: '過重' },
  obese: { en: 'Obese', zh: '肥胖' }
} as const;

const translate = (category: keyof typeof bmiCategories, lang: 'en' | 'zh'): string => {
  return bmiCategories[category][lang];
};

export const getBMICategory = (bmi: number, birthYear: number, birthMonth: number, birthDay: number, sex: string, matrix: MatrixEntry[], lang: 'zh' | 'en', assessmentDate: string): string => {
  const ranges = findBMIRanges(birthYear, birthMonth, birthDay, sex, matrix, assessmentDate);
  console.log('BMI Ranges:', ranges);
  
  const ageInDays = calculateAgeInDays(birthYear, birthMonth, birthDay, assessmentDate);
  const ageInYears = ageInDays / 365.25; // Using 365.25 to account for leap years
  const ageInMonths = ageInDays / 30.44; // Using 30.44 as average days per month
  console.log('Age in years:', ageInYears);
  console.log('Age in months:', ageInMonths);
  console.log('Current BMI:', bmi);

  // Check for underweight (BMI < 0.4th centile) - applies to all ages
  if (bmi < ranges.cent0_4) {
    console.log('Category: Underweight');
    return translate('underweight', lang);
  } else if (bmi >= ranges.cent0_4 && bmi < ranges.cent2) {
    console.log('Category: Lighter than normal');
    return translate('lighterThanNormal', lang);
  }

  // Check for overweight based on age
  if (ageInMonths <= 60) {
    // For children 0-60 months
    if (bmi > ranges.cent99_6) {
      console.log('Category: Obese (age <= 60 months)');
      return translate('obese', lang);
    } else if (bmi > ranges.cent98) {
      console.log('Category: Overweight (age <= 60 months)');
      return translate('overweight', lang);
    } else if (bmi > ranges.cent2) {
      console.log('Category: Normal (age <= 60 months)');
      return translate('normal', lang);
    }
  } else if (ageInYears > 5.0 && ageInYears < 18.0) {
    // For children >5.0 to <18.0 years
    if (bmi > ranges.cent98) {
      console.log('Category: Overweight (age >5.0 to <18.0 years)');
      return translate('obese', lang);
    } else if (bmi > ranges.cent91) {
      console.log('Category: Overweight (age >5.0 to <18.0 years)');
      return translate('overweight', lang);
    } else if (bmi > ranges.cent2) {
      console.log('Category: Normal (age >5.0 to <18.0 years)');
      return translate('normal', lang);
    }
  }
  
  // All other cases are normal
  console.log('Category: Normal');
  return translate('normal', lang);
}; 