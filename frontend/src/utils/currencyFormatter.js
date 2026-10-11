/**
 * Format a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (defaults to true)
 * @returns {string} Formatted currency string
 */
export const formatIndianRupee = (amount, showSymbol = true) => {
  // Check if amount is a valid number
  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  // Convert to fixed 2 decimal places
  const fixedAmount = Number(amount).toFixed(2);
  
  // Format with Indian thousand separator pattern (e.g., 1,23,456.78)
  const parts = fixedAmount.toString().split('.');
  let formattedInteger = parts[0];
  const decimal = parts[1];
  
  // Format the integer part with commas for thousands
  formattedInteger = formattedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // For values ≥ 1000, use Indian formatting (lakh, crore)
  if (Number(parts[0]) >= 1000) {
    formattedInteger = formattedInteger.replace(/,(\d{3})$/, ',$1');
  }
  
  // Combine with decimal part
  const formattedAmount = `${formattedInteger}.${decimal}`;
  
  // Add symbol if needed
  return showSymbol ? `₹${formattedAmount}` : formattedAmount;
};

/**
 * Legacy format for compatibility (to be deprecated)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return formatIndianRupee(amount);
}; 