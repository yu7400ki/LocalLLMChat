import React, { useState } from "react";

import { Cross1Icon } from "@radix-ui/react-icons";
import { Root as Label } from "@radix-ui/react-label";
import { css } from "@styled-system/css";

import { uuid } from "@/utils/uuid";

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string[];
  onChanges?: (value: string[]) => void;
} & JSX.IntrinsicElements["input"];

type Value = {
  id: string;
  value: string;
};

const AddField: React.FC<Props> = ({
  id,
  label,
  placeholder,
  defaultValue,
  onChanges,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState<Value[]>(
    defaultValue?.map((value) => ({ id: uuid(), value })) || [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
      setValues((prev) => {
        const newValue = { id: uuid(), value: inputValue };
        onChanges?.([...prev, newValue].map((v) => v.value));
        return [...prev, newValue];
      });
      setInputValue("");
    }
  };

  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className={css({
          fontSize: "md",
          lineHeight: "2.5rem",
          height: "2.5rem",
        })}
      >
        {label}
      </Label>
      <input
        id={id}
        {...props}
        className={css({
          "width": "100%",
          "fontSize": "md",
          "p": 3,
          "outlineWidth": "thin",
          "outlineStyle": "solid",
          "rounded": "lg",
          "color": "inherit",
          "_placeholder": {
            color: "text.placeholder",
            userSelect: "none",
          },
          "&:focus": {
            outlineWidth: "0.125rem",
            outlineColor: "orange.500",
          },
        })}
        autoComplete="off"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div
        className={css({
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          fontSize: "md",
          mt: 2,
        })}
      >
        {values.map((value) => (
          <AddedField
            key={value.id}
            value={value.value}
            onDelete={() => {
              setValues(values.filter((v) => v.id !== value.id));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(AddField);

type AddedProps = {
  onDelete: () => void;
  value: string;
};

const AddedField: React.FC<AddedProps> = ({ onDelete, value }) => {
  return (
    <div
      className={css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        bg: "slate.100",
        rounded: "full",
        pl: 3,
        pr: 2,
        py: 0.5,
      })}
    >
      <span>{value}</span>
      <button
        onClick={onDelete}
        className={css({
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          bg: "transparent",
          rounded: "full",
          p: 1,
          _hover: {
            bg: "slate.200",
          },
        })}
      >
        <Cross1Icon />
      </button>
    </div>
  );
};
