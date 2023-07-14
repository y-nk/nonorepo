import type { DMMF } from "@prisma/generator-helper";

// in case we need conversion of types
const PRISMA_TO_SCALARS: Record<string, string> = {};

function convertType(field: DMMF.Field, otherFields: DMMF.Field[]) {
  let fieldType =
    field.kind === "scalar" && field.type in PRISMA_TO_SCALARS
      ? PRISMA_TO_SCALARS[field.type]
      : field.type;

  if (field.isList) {
    const isRequired = field.relationFromFields?.some(
      (relationField) =>
        otherFields.find((otherField) => otherField.name === relationField)
          ?.isRequired
    );

    fieldType = `[${fieldType}${isRequired ? "!" : ""}]`;
  }

  return `${fieldType}${field.isRequired ? "!" : ""}`;
}

export function convertModel(model: DMMF.Model) {
  return [
    `type ${model.name} {`,
    ...model.fields.map(
      (field) => `  ${field.name}: ${convertType(field, model.fields)}`
    ),
    `}`,
  ].join("\n");
}
