import React, { ComponentProps } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface Props extends ComponentProps<'form'> {
  form: UseFormReturn;
  onSubmit: SubmitHandler<any>; // TODO
}

const Form = ({ children, form, onSubmit }: Props) => {
  return (
    <FormProvider {...form}>
      <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
};

export default Form;