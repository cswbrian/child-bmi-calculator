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
import { useMemo } from "react";

interface Props {
  formData: HealthFormData;
  onFormChange: (field: keyof HealthFormData, value: string) => void;
  t: Record<string, string>;
}

export const HealthForm = ({ formData, onFormChange, t }: Props) => {
  const currentYear = new Date().getFullYear();
  
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

  const handleHeightChange = (value: string) => {
    onFormChange("height", value);
  };

  const handleWeightChange = (value: string) => {
    onFormChange("weight", value);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t.assessmentDate}
            type="date"
            value={formData.assessmentDate}
            onChange={(e) => onFormChange("assessmentDate", e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Autocomplete
              value={formData.birthYear}
              onChange={(_, newValue) => onFormChange("birthYear", newValue || '')}
              onInputChange={(_, newInputValue) => {
                if (newInputValue !== formData.birthYear) {
                  onFormChange("birthYear", newInputValue);
                }
              }}
              options={years}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t.year}
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onFormChange("birthYear", (e.target as HTMLInputElement).value);
                    }
                  }}
                />
              )}
              sx={{ width: "50%" }}
              disableClearable
            />
            <Autocomplete
              value={formData.birthMonth}
              onChange={(_, newValue) => onFormChange("birthMonth", newValue || '')}
              onInputChange={(_, newInputValue) => {
                if (newInputValue !== formData.birthMonth) {
                  onFormChange("birthMonth", newInputValue);
                }
              }}
              options={months}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t.month}
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onFormChange("birthMonth", (e.target as HTMLInputElement).value);
                    }
                  }}
                />
              )}
              sx={{ width: "25%" }}
              disableClearable
            />
            <Autocomplete
              value={formData.birthDay}
              onChange={(_, newValue) => onFormChange("birthDay", newValue || '')}
              onInputChange={(_, newInputValue) => {
                if (newInputValue !== formData.birthDay) {
                  onFormChange("birthDay", newInputValue);
                }
              }}
              options={days}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t.day}
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onFormChange("birthDay", (e.target as HTMLInputElement).value);
                    }
                  }}
                />
              )}
              sx={{ width: "25%" }}
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
            inputProps={{
              step: "1",
              min: "50",
              max: "250",
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
