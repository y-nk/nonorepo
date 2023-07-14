const MD_FORMATTER_PROMPT = "use markdown format to structure your content.";

// main
const ada = {
  model: "ada",
  call: "createCompletion",
  prompt: (prompt) => ({ prompt: `${prompt}. ${MD_FORMATTER_PROMPT}` }),
  parse: ({ choices }) => choices[0].text,
};

const babbage = {
  model: "babbage",
  call: "createCompletion",
  prompt: (prompt) => ({ prompt: `${prompt}. ${MD_FORMATTER_PROMPT}` }),
  parse: ({ choices }) => choices[0].text,
};

const curie = {
  model: "curie",
  call: "createCompletion",
  prompt: (prompt) => ({ prompt: `${prompt}. ${MD_FORMATTER_PROMPT}` }),
  parse: ({ choices }) => choices[0].text,
};

const davinci = {
  model: "davinci",
  call: "createCompletion",
  prompt: (prompt) => ({ prompt: `${prompt}. ${MD_FORMATTER_PROMPT}` }),
  parse: ({ choices }) => choices[0].text,
};

const gpt_35_turbo = {
  model: "gpt-3.5-turbo",
  call: "createChatCompletion",
  prompt: (prompt) => ({
    messages: [
      {
        role: "system",
        content: MD_FORMATTER_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  }),
  parse: ({ choices }) => choices[0].message.content,
};

const gpt_4 = {
  model: "gpt4",
  call: "createChatCompletion",
  prompt: (prompt) => ({
    messages: [
      {
        role: "system",
        content: MD_FORMATTER_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  }),
  parse: ({ choices }) => choices[0].message.content,
};

// derivates
const text_ada_001 = {
  ...ada,
  model: "text-ada-001",
};

const text_babbage_001 = {
  ...babbage,
  model: "text-babbage-001",
};

const text_curie_001 = {
  ...curie,
  model: "text-curie-001",
};

const text_davinci_002 = {
  ...davinci,
  model: "text-davinci-002",
};

const text_davinci_003 = {
  ...davinci,
  model: "text-davinci-003",
};

const gpt_35_turbo_0301 = {
  ...gpt_35_turbo,
  model: "gpt-3.5-turbo-0301",
};

const gpt_4_32k = {
  ...gpt_4,
  model: "gpt-4-32k",
};

const gpt_4_0314 = {
  ...gpt_4,
  model: "gpt-4-0314",
};

const gpt_4_32k_0314 = {
  ...gpt_4,
  model: "gpt-4-32k-0314",
};

const enabledModels = [
  ada,
  babbage,
  curie,
  davinci,
  gpt_35_turbo,
  gpt_4,
  text_ada_001,
  text_babbage_001,
  text_curie_001,
  text_davinci_002,
  text_davinci_003,
  gpt_35_turbo_0301,
  gpt_4_32k,
  gpt_4_0314,
  gpt_4_32k_0314,
];

export default Object.fromEntries(
  enabledModels.map((modelConfiguration) => [
    modelConfiguration.model,
    modelConfiguration,
  ])
);
