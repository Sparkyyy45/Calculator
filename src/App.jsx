import { useState, useEffect } from "react";
import "./App.css";

const operators = ["+", "-", "*", "/"];

const isOperator = (value) => operators.includes(value);

const getLastNumber = (expression) => {
  const parts = expression.split(/[-+*/]/);
  return parts[parts.length - 1] ?? "";
};

const isValidExpression = (expression) => {
  if (!expression) {
    return false;
  }

  if (!/^[0-9+\-*/.]+$/.test(expression)) {
    return false;
  }

  if (/[+\-*/.]$/.test(expression)) {
    return false;
  }

  return true;
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Number(value.toFixed(10));
  return Number.isFinite(rounded) ? String(rounded) : "Error";
};

const evaluateExpression = (expression) => {
  const sanitized = expression.replace(/\s+/g, "");
  if (!isValidExpression(sanitized)) {
    return "Error";
  }

  const computed = Function(`"use strict";return (${sanitized})`)();
  return formatNumber(computed);
};

const buttons = [
  "C",
  "DEL",
  "/",
  "*",
  "7",
  "8",
  "9",
  "-",
  "4",
  "5",
  "6",
  "+",
  "1",
  "2",
  "3",
  "=",
  "0",
  ".",
];

export default function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");

  const handleClear = () => {
    setExpression("");
    setResult("0");
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleOperator = (value) => {
    if (!expression) {
      if (value === "-") {
        setExpression(value);
      }
      return;
    }

    if (isOperator(expression.slice(-1))) {
      setExpression((prev) => prev.slice(0, -1) + value);
      return;
    }

    setExpression((prev) => prev + value);
  };

  const handleDot = () => {
    if (!expression || isOperator(expression.slice(-1))) {
      setExpression((prev) => prev + "0.");
      return;
    }

    const lastNumber = getLastNumber(expression);
    if (lastNumber.includes(".")) {
      return;
    }

    setExpression((prev) => prev + ".");
  };

  const handleDigit = (value) => {
    setExpression((prev) => prev + value);
  };

  const handleEquals = () => {
    const evaluation = evaluateExpression(expression);
    setResult(evaluation);
    if (evaluation !== "Error") {
      setExpression(evaluation);
    }
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
        return;
      }

      if (e.key === "Delete" || e.key === "Escape") {
        e.preventDefault();
        handleClear();
        return;
      }

      if (e.key === ".") {
        e.preventDefault();
        handleDot();
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
        return;
      }

      if (isOperator(e.key)) {
        e.preventDefault();
        handleOperator(e.key);
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expression]);

  const [copied, setCopied] = useState(false);
  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(String(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      // ignore
    }
  };

  const handleButton = (value) => {
    if (value === "C") {
      handleClear();
      return;
    }

    if (value === "DEL") {
      handleDelete();
      return;
    }

    if (value === "=") {
      handleEquals();
      return;
    }

    if (value === ".") {
      handleDot();
      return;
    }

    if (isOperator(value)) {
      handleOperator(value);
      return;
    }

    handleDigit(value);
  };

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <div className="header">
        <div className="title">Calculator</div>
      </div>
      <div className="display" aria-live="polite">
        <div className="expression">{expression || "0"}</div>
        <div
          className="result"
          title="Click to copy result"
          onClick={copyResult}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') copyResult(); }}
          aria-label={`Result ${result}. Click to copy`}
        >
          {result}
          <span className={`tooltip ${copied ? 'visible' : ''}`} aria-hidden>{copied ? 'Copied!' : 'Copy'}</span>
        </div>
      </div>
      <div className="buttons">
        {buttons.map((label) => (
          <button
            key={label}
            type="button"
            className={
              isOperator(label)
                ? "operator"
                : label === "="
                  ? "equals"
                  : label === "C" || label === "DEL"
                    ? "action"
                    : undefined
            }
            onClick={() => handleButton(label)}
            aria-label={label === "DEL" ? "Delete" : label}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
