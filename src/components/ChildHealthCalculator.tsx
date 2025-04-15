import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Language, translations } from '../i18n/translations';
import { HealthForm } from './HealthForm';
import { HealthResults, HealthFormData } from '../types/health';
import { calculateAge, calculateBMI, getWeightCategory } from '../utils/healthCalculations';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';

const ChildHealthCalculator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState<HealthFormData>({
    birthYear: searchParams.get('birthYear') || '',
    birthMonth: searchParams.get('birthMonth') || '',
    birthDay: searchParams.get('birthDay') || '',
    height: searchParams.get('height') || '',
    weight: searchParams.get('weight') || '',
    sex: searchParams.get('sex') || '',
  });
  
  const [lang, setLang] = useState<Language>(searchParams.get('lang') as Language || 'zh');
  const [results, setResults] = useState<HealthResults | null>(null);

  const t = translations[lang];

  const handleFormChange = (field: keyof HealthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Update URL parameters when form changes
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(field, value);
    } else {
      newParams.delete(field);
    }
    setSearchParams(newParams);
  };

  const generateShareLink = () => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('lang', lang);
    return `${window.location.origin}${window.location.pathname}#/?${params.toString()}`;
  };

  const handleShare = () => {
    const shareLink = generateShareLink();
    navigator.clipboard.writeText(shareLink).then(() => {
      alert(t.shareLink + ' ' + (lang === 'zh' ? '已複製到剪貼板' : 'copied to clipboard'));
    });
  };

  const isFormComplete = () => {
    return Object.values(formData).every(value => value !== '');
  };

  useEffect(() => {
    if (isFormComplete()) {
      console.log('Form Data:', formData);
      const age = calculateAge(formData.birthYear, formData.birthMonth, formData.birthDay);
      console.log('Calculated Age:', age);
      
      const bmi = calculateBMI(formData.height, formData.weight);
      console.log('Calculated BMI:', bmi);
      
      const category = getWeightCategory(
        bmi, 
        formData.sex, 
        lang,
        formData.birthYear,
        formData.birthMonth,
        formData.birthDay
      );
      console.log('Weight Category:', category);
      
      setResults({ age, bmi, category });
    } else {
      console.log('Form is not complete');
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
          <Box>
            <Tooltip title={t.shareLink}>
              <IconButton 
                onClick={handleShare}
                size="small"
                aria-label="Share link"
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={lang === 'zh' ? 'Switch to English' : '切換至中文'}>
              <IconButton 
                onClick={toggleLanguage}
                size="small"
                aria-label="Toggle language"
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          </Box>
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

        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            <a 
              href="https://www.dh.gov.hk/english/useful/useful_HP_Growth_Chart/useful_HP_Growth_Chart.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              {t.dataSource}
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChildHealthCalculator; 