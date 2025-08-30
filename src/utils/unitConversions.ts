// Unit conversion utilities for SciOptimal
// Converts between metric (kg, cm) and imperial (lbs, feet/inches) units

export const kgToLbs = (kg: number): number => {
  return kg * 2.20462;
};

export const lbsToKg = (lbs: number): number => {
  return lbs / 2.20462;
};

export const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const feetInchesToCm = (feet: number, inches: number): number => {
  return (feet * 12 + inches) * 2.54;
};

export const feetInchesToInches = (feet: number, inches: number): number => {
  return feet * 12 + inches;
};

export const inchesToFeetInches = (totalInches: number): { feet: number; inches: number } => {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const formatHeight = (heightInches: number): string => {
  const { feet, inches } = inchesToFeetInches(heightInches);
  return `${feet}'${inches}"`;
};

export const formatWeight = (weightLbs: number): string => {
  return `${weightLbs} lbs`;
};

export const parseHeightInput = (heightInput: string): number | null => {
  const match = heightInput.match(/(\d+)'(\d+)"/);
  if (match) {
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    if (feet >= 0 && feet <= 8 && inches >= 0 && inches <= 11) {
      return feetInchesToInches(feet, inches);
    }
  }
  return null;
};

export const getHeightPlaceholder = (): string => {
  return "5'10\"";
};

export const getWeightPlaceholder = (): string => {
  return "185";
};

export const validateHeight = (heightInches: number): boolean => {
  return heightInches >= 48 && heightInches <= 96; // 4'0" to 8'0"
};

export const validateWeight = (weightLbs: number): boolean => {
  return weightLbs >= 80 && weightLbs <= 400;
};

export const getHeightRange = (): string => {
  return "4'0\" - 8'0\"";
};

export const getWeightRange = (): string => {
  return "80 - 400 lbs";
};
