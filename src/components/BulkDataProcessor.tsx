import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { HealthResults } from '../types/health';
import { calculateAge, calculateBMI, getWeightCategory } from '../utils/healthCalculations';
import { Language } from '../i18n/translations';

interface BulkDataRow {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  height: string;
  weight: string;
  sex: string;
  [key: string]: string; // Allow for additional columns
}

interface ProcessedResult extends HealthResults {
  originalData: BulkDataRow;
  originalColumns: string[];
  originalValues: string[];
}

interface BulkDataProcessorProps {
  lang: Language;
  t: Record<string, string>;
}

export const BulkDataProcessor = ({ lang, t }: BulkDataProcessorProps) => {
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [error, setError] = useState<string>('');

  const parseCSVRow = (header: string[], row: string): { data: BulkDataRow | null, values: string[] } => {
    const values = row.split(',').map(item => item.trim());
    if (values.length !== header.length) return { data: null, values: [] };

    const rowData: Partial<BulkDataRow> = {};
    
    header.forEach((col, index) => {
      const value = values[index];
      if (col.toLowerCase().includes('sex')) {
        rowData.sex = value.toUpperCase();
      } else if (col.toLowerCase().includes('year')) {
        rowData.birthYear = value;
      } else if (col.toLowerCase().includes('month')) {
        rowData.birthMonth = value;
      } else if (col.toLowerCase().includes('day')) {
        rowData.birthDay = value;
      } else if (col.toLowerCase().includes('height')) {
        rowData.height = value;
      } else if (col.toLowerCase().includes('weight')) {
        rowData.weight = value;
      }
      // Store all original values
      rowData[col] = value;
    });

    // Check if all required fields are present
    if (!rowData.sex || !rowData.birthYear || !rowData.birthMonth || !rowData.birthDay || !rowData.height || !rowData.weight) {
      return { data: null, values: [] };
    }

    return { data: rowData as BulkDataRow, values };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const header = lines[0].split(',').map(item => item.trim());
        const rows = lines.slice(1); // Skip header row
        const processedResults: ProcessedResult[] = [];

        rows.forEach((row, index) => {
          if (!row.trim()) return; // Skip empty rows

          const { data: originalData, values } = parseCSVRow(header, row);
          if (!originalData) {
            throw new Error(`Invalid data format in row ${index + 2}`);
          }

          // Pad month and day with leading zeros if needed
          const paddedMonth = originalData.birthMonth.padStart(2, '0');
          const paddedDay = originalData.birthDay.padStart(2, '0');

          const age = calculateAge(originalData.birthYear, paddedMonth, paddedDay);
          const bmi = calculateBMI(originalData.height, originalData.weight);
          const category = getWeightCategory(
            bmi,
            originalData.sex,
            lang,
            originalData.birthYear,
            paddedMonth,
            paddedDay
          );

          processedResults.push({ 
            age, 
            bmi, 
            category, 
            originalData,
            originalColumns: header,
            originalValues: values
          });
        });

        setResults(processedResults);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing file');
        setResults([]);
      }
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (results.length === 0) return;

    const headers = [
      ...results[0].originalColumns,
      'Age (years)',
      'BMI',
      'Weight Status'
    ];

    const csvContent = [
      headers.join(','),
      ...results.map(result => {
        const row = [
          ...result.originalValues,
          result.age,
          result.bmi,
          result.category
        ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bmi_calculator_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t.bulkProcessing || 'Bulk Data Processing'}
        </Typography>

        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{t.howToUse || 'How to Use'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t.bulkProcessingInstructions || 'Prepare your CSV file with the following columns:'}
            </Typography>
            <Box component="pre" sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {t.csvFormat || 'sex,birthYear,birthMonth,birthDay,height,weight'}
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t.bulkProcessingNotes || 'Notes:'}
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  {t.bulkProcessingNote1 || 'The first row must be the header row with column names'}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t.bulkProcessingNote2 || 'sex: Use "M" for male or "F" for female'}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t.bulkProcessingNote3 || 'birthYear, birthMonth, birthDay: Use numbers (e.g., 2015, 8, 15)'}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t.bulkProcessingNote4 || 'height: Height in centimeters (e.g., 120)'}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t.bulkProcessingNote5 || 'weight: Weight in kilograms (e.g., 25.5)'}
                </Typography>
              </li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t.bulkProcessingExample || 'Example:'}
            </Typography>
            <Box component="pre" sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {t.csvExample || `sex,birthYear,birthMonth,birthDay,height,weight
M,2015,8,15,120,25.5
F,2016,12,3,110,20.2`}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
          >
            {t.uploadCSV || 'Upload CSV'}
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileUpload}
            />
          </Button>
          {results.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              {t.downloadResults || 'Download Results'}
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {results[0].originalColumns.map((column, index) => (
                    <TableCell key={index}>{column}</TableCell>
                  ))}
                  <TableCell>{t.age}</TableCell>
                  <TableCell>{t.bmiLabel}</TableCell>
                  <TableCell>{t.weightStatus}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    {result.originalValues.map((value, colIndex) => (
                      <TableCell key={colIndex}>{value}</TableCell>
                    ))}
                    <TableCell>{result.age} {t.years}</TableCell>
                    <TableCell>{result.bmi}</TableCell>
                    <TableCell>{result.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}; 