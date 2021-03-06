const Templator = require("../lib/templator");
const { existingConfigDir } = require("./data");

describe("Given a destination template and a context", () => {
  test("Should return components template rendered for development", () => {
    const tr = new Templator(existingConfigDir);
    expect(tr.render("components.js", "development")).toStrictEqual({
      locations: [
        {
          template: "components/database.njk",
          contextSelector: "components.database",
          destination: {},
          renderedTemplate: "size: 5\n",
        },
      ],
    });
  });

  test("Should return components template rendered for production", () => {
    const tr = new Templator(existingConfigDir);
    expect(tr.render("components.js", "production")).toStrictEqual({
      locations: [
        {
          template: "components/application.njk",
          contextSelector: "components.application",
          destination: {},
          renderedTemplate: "replication: 5\n",
        },
        {
          template: "components/database.njk",
          contextSelector: "components.database",
          destination: {},
          renderedTemplate: "size: 20\n",
        },
      ],
    });
  });
});
