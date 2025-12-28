export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateVehicleData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.make?.trim()) errors.push("Make is required");
  if (!data.model?.trim()) errors.push("Model is required");
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push("Valid year is required");
  }
  if (!data.price || data.price <= 0) errors.push("Valid price is required");
  if (!data.condition) errors.push("Condition is required");
  
  return { valid: errors.length === 0, errors };
};
