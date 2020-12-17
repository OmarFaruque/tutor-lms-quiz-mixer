import React from 'react';
import style from './textinput.scss';

export default function TextInput(props) {
  const { label,customClass, name, type, value, placeholder, min, onChange } = props;

  return (
    <div className={style.form_group}>
      {label && (
        <label htmlFor={name} className={style.form_label}>
          {label}
        </label>
      )}
      {type === 'number' && (
        <input
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          type={type}
          value={value}
          min={min}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'textarea' && (
        <textarea
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'email' && (
        <input
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {type === 'text' && (
        <input
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}