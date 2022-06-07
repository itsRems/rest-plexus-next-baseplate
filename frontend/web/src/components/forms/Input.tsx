import React, { ComponentProps, forwardRef } from 'react';
import { useFormState } from "react-hook-form";

interface Props extends ComponentProps<'input'> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({type = 'text', label = '', ...props}, ref) => {
    const { errors } = useFormState();
    const error = errors[props.name!]?.message;

    return (
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            {...props}
            ref={ref}
            type={type}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <span className={"text-sm text-red-500"}>{error}</span>
      </div>
    );
  }
);

export default Input;
