import * as yup from "yup";

export const faqSchema = yup.object({
    question: yup.string().trim().required("Question is required!"),
    answer: yup.string().trim().required("Answer is required!"),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

