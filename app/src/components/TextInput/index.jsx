import React from 'react';
import style from './textinput.scss';

export default function TextInput(props) {
  const { label,customClass, name, type, value, placeholder, min, onChange, options } = props;

  const items = [];
  
  if(typeof options != 'undefined'){
    Object.keys(options).forEach(function(k, v){
      items.push(<option key={v} value={k}>{options[k]}</option>);  
    });
  }

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
      {type === 'select' && (
        <select
          className={
            customClass
              ? `${customClass} ${style.form_control}`
              : style.form_control
          }
          id={name}
          name={name}
          onChange={onChange}
        >
        {items.map(function(object, key){
          return(
            object
          )
        })}
        </select>
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