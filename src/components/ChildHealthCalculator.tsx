import { useState } from 'react';
import { Container, Tabs, Tab } from '@mui/material';
import { Language, translations } from '../i18n/translations';
import { SingleCalculator } from './SingleCalculator';
import { BulkDataProcessor } from './BulkDataProcessor';

const ChildHealthCalculator = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [activeTab, setActiveTab] = useState(0);

  const t = translations[lang];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('event', event);
    setActiveTab(newValue);
  };

  const toggleLanguage = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  return (
    <Container>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={t.calculatorTitle} />
        <Tab label={t.bulkProcessing} />
      </Tabs>

      {activeTab === 0 ? (
        <SingleCalculator lang={lang} onToggleLanguage={toggleLanguage} />
      ) : (
        <BulkDataProcessor lang={lang} t={t} />
      )}
    </Container>
  );
};

export default ChildHealthCalculator; 