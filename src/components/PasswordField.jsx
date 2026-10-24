import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({ id, value, onChange, placeholder, minLength, autoComplete, required = true, visible, onToggleVisible }) {
  const [localVisible, setLocalVisible] = useState(false);
  const shown = visible ?? localVisible;
  const toggle = onToggleVisible ?? (() => setLocalVisible((v) => !v));

  return (
    <div className="input-with-icon has-action">
      <Lock size={16} className="input-icon" />
      <Form.Control
        id={id}
        type={shown ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minLength={minLength}
        autoComplete={autoComplete}
        required={required}
      />
      <button
        type="button"
        className="input-action"
        onClick={toggle}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
      >
        {shown ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
