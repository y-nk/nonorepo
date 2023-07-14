import type { DMMF } from "@prisma/generator-helper";

export function convertEnum(enumModel: DMMF.DatamodelEnum) {
  return [
    `enum ${enumModel.name} {`,
    ...enumModel.values.map((enumValue) => `  ${enumValue.name.toUpperCase()}`),
    `}`,
  ].join("\n");
}
