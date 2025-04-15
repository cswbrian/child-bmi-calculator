import { differenceInYears, differenceInMonths } from 'date-fns';
import { Language } from '../i18n/translations';
import { getBMICategory } from '../services/bmiService';
import matrixData from '../data/matrix.json';

export const calculateAge = (birthYear: string, birthMonth: string, birthDay: string): number => {
  // Ensure month and day are padded with leading zeros if needed
  const paddedMonth = birthMonth.padStart(2, '0');
  const paddedDay = birthDay.padStart(2, '0');
  
  // Create date string in YYYY-MM-DD format
  const dateString = `${birthYear}-${paddedMonth}-${paddedDay}`;
  const birthDate = new Date(dateString);
  
  // Validate the date
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid date:', dateString);
    return 0;
  }
  
  const today = new Date();
  
  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  return Number((years + months / 12).toFixed(1));
};

export const calculateBMI = (height: string, weight: string): number => {
  const heightInM = parseFloat(height) / 100;
  const weightInKg = parseFloat(weight);
  return Number((weightInKg / (heightInM * heightInM)).toFixed(1));
};

export const getWeightCategory = (
  bmi: number, 
  sex: string, 
  language: Language,
  birthYear: string,
  birthMonth: string,
  birthDay: string
): string => {
  return getBMICategory(
    bmi, 
    parseInt(birthYear), 
    parseInt(birthMonth), 
    parseInt(birthDay), 
    sex, 
    matrixData, 
    language
  );
}; 