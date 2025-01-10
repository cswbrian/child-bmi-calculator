import { HealthFormData } from "../types/health";
import {
  TextField,
  Grid,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Autocomplete,
} from "@mui/material";
import { useMemo, useState } from "react";

interface Props {
  formData: HealthFormData;
  onFormChange: (field: keyof HealthFormData, value: string) => void;
  t: Record<string, string>;
}

export const HealthForm = ({ formData, onFormChange, t }: Props) => {
  const currentYear = new Date().getFullYear();
  const [heightError, setHeightError] = useState<string>('');
  const [weightError, setWeightError] = useState<string>('');
  
  const years = useMemo(() => {
    const minYear = currentYear - 18;
    return Array.from(
      { length: currentYear - minYear + 1 },
      (_, i) => (minYear + i).toString()
    );
  }, [currentYear]);

  const months = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
    []
  );

  const days = useMemo(() => 
    Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')),
    []
  );

  const validateHeight = (value: string) => {
    const height = parseFloat(value);
    if (value === '') {
      setHeightError('');
      return true;
    }
    if (isNaN(height)) {
      setHeightError(t.invalidNumber);
      return false;
    }
    if (height < 0.5) {
      setHeightError(t.heightTooLow);
      return false;
    }
    if (height > 2.5) {
      setHeightError(t.heightTooHigh);
      return false;
    }
    setHeightError('');
    return true;
  };

  const validateWeight = (value: string) => {
    const weight = parseFloat(value);
    if (value === '') {
      setWeightError('');
      return true;
    }
    if (isNaN(weight)) {
      setWeightError(t.invalidNumber);
      return false;
    }
    if (weight < 2) {
      setWeightError(t.weightTooLow);
      return false;
    }
    if (weight > 200) {
      setWeightError(t.weightTooHigh);
      return false;
    }
    setWeightError('');
    return true;
  };

  const handleHeightChange = (value: string) => {
    if (validateHeight(value)) {
      onFormChange("height", value);
    }
  };

  const handleWeightChange = (value: string) => {
    if (validateWeight(value)) {
      onFormChange("weight", value);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Autocomplete
              value={formData.birthYear}
              onChange={(_, newValue) => onFormChange("birthYear", newValue || '')}
              options={years}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t.year}
                  size="small"
                />
              )}
              sx={{ width: "33%" }}
              disableClearable
            />
            <Autocomplete
              value={formData.birthMonth}
              onChange={(_, newValue) => onFormChange("birthMonth", newValue || '')}
              options={months}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t.month}
                  size="small"
                />
              )}
              sx={{ width: "33%" }}
              disableClearable
            />
            <Autocomplete
              value={formData.birthDay}
              onChange={(_, newValue) => onFormChange("birthDay", newValue || '')}
              options={days}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t.day}
                  size="small"
                />
              )}
              sx={{ width: "33%" }}
              disableClearable
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t.height}
            type="number"
            value={formData.height}
            onChange={(e) => handleHeightChange(e.target.value)}
            size="small"
            error={!!heightError}
            helperText={heightError}
            inputProps={{
              step: "0.01",
              min: "0.5",
              max: "2.5",
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t.weight}
            type="number"
            value={formData.weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            size="small"
            error={!!weightError}
            helperText={weightError}
            inputProps={{
              step: "0.1",
              min: "2",
              max: "200",
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl>
            <FormLabel>{t.sex}</FormLabel>
            <RadioGroup
              row
              value={formData.sex}
              onChange={(e) => onFormChange("sex", e.target.value)}
            >
              <FormControlLabel
                value="M"
                control={<Radio size="small" />}
                label={t.male}
              />
              <FormControlLabel
                value="F"
                control={<Radio size="small" />}
                label={t.female}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};