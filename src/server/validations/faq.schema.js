import * as yup from "yup";

export const faqSchema = yup.object({
    question: yup.string().required("Question is required!"),
    answer: yup.string().required("Answer is required!"),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

