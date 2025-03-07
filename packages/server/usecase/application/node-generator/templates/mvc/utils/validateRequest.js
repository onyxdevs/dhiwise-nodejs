exports.validateParamsWithJoi = (payload, schemaKeys) => {
  const { error } = schemaKeys.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true };
};
