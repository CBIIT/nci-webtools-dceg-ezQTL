import React from 'react';
import { Form } from 'react-bootstrap';
import ReactSelect, { createFilter } from 'react-select';

const { Group, Label } = Form;

export default function Select({
  className,
  id,
  label,
  value,
  options,
  onChange,
  disabled,
}) {
  const props = {
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    },
    menuPortalTarget: document.body,
    getOptionLabel: (option) => (option == 'NA' ? 'N/A' : option),
    getOptionValue: (option) => option,
    filterOption: createFilter({ ignoreAccents: false }),
  };

  return (
    <Group controlId={id} className={className}>
      <Label>{label}</Label>
      <ReactSelect
        inputId={id}
        options={options}
        value={[value] || [options[0]]}
        onChange={onChange}
        isDisabled={disabled}
        {...props}
      />
    </Group>
  );
}
