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
  ...rest
}) {
  const props = {
    ...rest,
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    },
    menuPortalTarget: document.body,
    filterOption: createFilter({ ignoreAccents: false }),
  };

  return (
    <Group controlId={id} className={className}>
      <Label className="mb-0">{label}</Label>
      <ReactSelect
        inputId={id}
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
        {...props}
      />
    </Group>
  );
}
