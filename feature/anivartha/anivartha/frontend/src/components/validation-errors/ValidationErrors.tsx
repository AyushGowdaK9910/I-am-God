/**
 * CON-5: Validation Errors Component
 */

import React from 'react';

interface ValidationErrorsProps {
  errors: string[];
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="validation-errors" style={{
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      padding: '10px',
      borderRadius: '4px',
      margin: '10px 0',
    }}>
      <h3>Validation Errors (CON-5)</h3>
      <ul>
        {errors.map((error, index) => (
          <li key={index} style={{ color: '#c00' }}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationErrors;

