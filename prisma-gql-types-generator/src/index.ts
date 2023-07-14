#!/usr/bin/env node
import { writeFile } from "fs/promises";
import { join, resolve } from "path";
import { mkdirp } from "mkdirp";

import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";

import { convertEnum } from "./convertEnum";
import { convertModel } from "./convertModel";

const defaultOutput = "./node_modules/@generated/graphql";

generatorHandler({
  onManifest: () => ({
    defaultOutput,
    prettyName: "prisma enums and models to graphql",
  }),
  onGenerate: async ({ dmmf, generator }: GeneratorOptions) => {
    const out = resolve(generator.config.output ?? defaultOutput);
    await mkdirp(out);

    const ext = generator.config.extension ?? "graphql";

    const { enums, models } = dmmf.datamodel;

    const gqlEnums = enums.map(convertEnum).join("\n\n");
    await writeFile(join(out, `enums.${ext}`), gqlEnums, "utf-8");

    const gqlTypes = models.map(convertModel).join("\n\n");
    await writeFile(join(out, `types.${ext}`), gqlTypes, "utf-8");
  },
});
