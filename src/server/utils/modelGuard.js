export const ensureModel = (model, name = "requested") => {
    if (!model) {
        throw new Error(`${name} storage is not configured. Please create the ${name} table before using this module.`);
    }
    return model;
};


