import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';
import { Language, translations } from '../i18n/translations';
import { HealthForm } from './HealthForm';
import { HealthResults, HealthFormData } from '../types/health';
import { calculateAge, calculateBMI, getWeightCategory } from '../utils/healthCalculations';

interface SingleCalculatorProps {
  lang: Language;
  onToggleLanguage: () => void;
}

export const SingleCalculator = ({ lang, onToggleLanguage }: SingleCalculatorProps) => {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [formData, setFormData] = useState<HealthFormData>({
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    height: '',
    weight: '',
    sex: '',
    assessmentDate: todayString,
  });
  
  const [results, setResults] = useState<HealthResults | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const t = translations[lang];

  const handleFormChange = (field: keyof HealthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate birth date when either birth date or assessment date changes
    if (field === 'birthYear' || field === 'birthMonth' || field === 'birthDay' || field === 'assessmentDate') {
      validateBirthDate();
    }
  };

  const validateBirthDate = () => {
    if (formData.birthYear && formData.birthMonth && formData.birthDay && formData.assessmentDate) {
      const birthDate = new Date(
        parseInt(formData.birthYear),
        parseInt(formData.birthMonth) - 1,
        parseInt(formData.birthDay)
      );
      const assessmentDate = new Date(formData.assessmentDate);
      
      if (birthDate > assessmentDate) {
        setBirthDateError(t.birthDateError);
        setResults(null);
      } else {
        setBirthDateError(null);
      }
    }
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
      const age = calculateAge(formData.birthYear, formData.birthMonth, formData.birthDay, formData.assessmentDate);
      const bmi = calculateBMI(formData.height, formData.weight);
      const category = getWeightCategory(
        bmi, 
        formData.sex, 
        lang,
        formData.birthYear,
        formData.birthMonth,
        formData.birthDay,
        formData.assessmentDate
      );
      
      setResults({ age, bmi, category });
    } else {
      setResults(null);
    }
  }, [formData, lang]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, maxWidth: 'xs', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          {t.calculatorTitle}
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
              onClick={onToggleLanguage}
              size="small"
              aria-label="Toggle language"
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {birthDateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {birthDateError}
        </Alert>
      )}
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
                primary={`${t.assessmentDate}：${formData.assessmentDate}`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={`${t.age}：${results.age.toFixed(2)} ${t.years}`}
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
  );
}; 