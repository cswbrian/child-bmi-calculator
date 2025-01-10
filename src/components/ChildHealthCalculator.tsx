import { useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';
import { HealthForm } from './HealthForm';
import { HealthResults, HealthFormData } from '../types/health';
import { calculateAge, calculateBMI, getWeightCategory } from '../utils/healthCalculations';
import { 
  Container, 
  Paper, 
  Typography, 
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const ChildHealthCalculator = () => {
  const [formData, setFormData] = useState<HealthFormData>({
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    height: '',
    weight: '',
    sex: '',
  });
  
  const [lang, setLang] = useState<Language>('zh');
  const [results, setResults] = useState<HealthResults | null>(null);

  const t = translations[lang];

  const handleFormChange = (field: keyof HealthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormComplete = () => {
    return Object.values(formData).every(value => value !== '');
  };

  useEffect(() => {
    if (isFormComplete()) {
      const age = calculateAge(formData.birthYear, formData.birthMonth, formData.birthDay);
      const bmi = calculateBMI(formData.height, formData.weight);
      const category = getWeightCategory(bmi, age, formData.sex, lang);
      setResults({ age, bmi, category });
    } else {
      setResults(null);
    }
  }, [formData, lang]);

  const toggleLanguage = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {t.title}
          </Typography>
          <Button 
            variant="outlined"
            size="small"
            onClick={toggleLanguage}
          >
            {t.switchLang}
          </Button>
        </Box>

        <HealthForm
          formData={formData}
          onFormChange={handleFormChange}
          t={t}
        />

        {results && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t.results}
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary={`${t.age}：${results.age} ${t.years}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary={`${t.bmiLabel}：${results.bmi}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary={`${t.sex}：${formData.sex === 'F' ? t.female : t.male}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary={`${t.weightStatus}：${results.category}`}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChildHealthCalculator; 