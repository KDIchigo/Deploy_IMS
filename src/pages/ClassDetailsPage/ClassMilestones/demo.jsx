import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  selectedOption: '',
};

const validationSchema = Yup.object().shape({
  selectedOption: Yup.string().required('Please select an option'),
});

export const Demo = () => {
  const handleReset = (formikBag) => {
    formikBag.resetForm();
  };

  const handleSubmit = (values) => {
    // Handle form submission with the selected value
    console.log('Selected Option:', values.selectedOption);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Form>
          <div>
            <label htmlFor="selectedOption">Select an option:</label>
            <Field as="select" name="selectedOption">
              <option value="" label="Select an option" />
              <option value="option1" label="Option 1" />
              <option value="option2" label="Option 2" />
              <option value="option3" label="Option 3" />
            </Field>
            <ErrorMessage name="selectedOption" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting}>Submit</button>
          <button type="button" onClick={() => resetForm(initialValues)}>Reset</button>
        </Form>
      )}
    </Formik>
  );
};
