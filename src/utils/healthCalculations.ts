import { differenceInYears, differenceInMonths } from 'date-fns';
import { Language } from '../i18n/translations';
import { getBMICategory } from '../services/bmiService';
import matrixData from '../data/matrix.json';

export const calculateAge = (birthYear: string, birthMonth: string, birthDay: string): number => {
  const birthDate = new Date(
    parseInt(birthYear),
    parseInt(birthMonth) - 1,
    parseInt(birthDay)
  );
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
export const getWeightCategory = (bmi: number, age: number, sex: string, language: Language): string => {
  const [year, month, day] = age.toString().split('.');
  return getBMICategory(bmi, parseInt(year), parseInt(month || '1'), parseInt(day || '1'), sex, matrixData, language);
}; 