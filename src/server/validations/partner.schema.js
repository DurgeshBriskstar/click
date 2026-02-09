import * as yup from "yup";

export const partnerSchema = yup.object({
    partner_name: yup.string().required("Partner name is required!"),
    image: yup.mixed().nullable(),
    description: yup.string().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

