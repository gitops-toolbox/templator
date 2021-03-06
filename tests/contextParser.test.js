const ContextParser = require("../lib/contextParser");
const { expectedContext, existingConfigDir } = require("./data");

describe("Context parser", () => {
  describe("When context is empty", () => {
    test("Should return an error?", () => {
      const cp = new ContextParser(existingConfigDir, {
        contextDir: "emptycontext",
      });
      expect(cp.context).toStrictEqual({});
    });
  });

  describe("When loading a sparse context", () => {
    test("Should return a parsed context", () => {
      const cp = new ContextParser(existingConfigDir, {
        contextDir: "sparsecontext",
      });
      expect(cp.context).toStrictEqual({
        layer1: { layer2: { test: "test" } },
      });
    });
  });

  describe("When context is present", () => {
    let cp;

    beforeEach(() => {
      cp = new ContextParser(existingConfigDir);
    });

    test("Should return an object merging all context files", () => {
      expect(cp.context).toStrictEqual(expectedContext);
    });

    test("Should return a list of context files", () => {
      expect(cp.contextFiles).toStrictEqual([
        "context/base.json",
        "context/development/context.json",
        "context/production/context.json",
        "context/staging/base.json",
        "context/staging/context.json",
        "context/development/components/base.json",
        "context/production/components/base.json",
        "context/staging/components/base.json",
      ]);
    });

    test("Should return a selection of the context", () => {
      expect(cp.fromSelector("development")).toMatchObject(
        expectedContext.development
      );
      expect(cp.fromSelector("development.components")).toStrictEqual(
        expectedContext.development.components
      );
      expect(cp.fromSelector(["development", "components"])).toStrictEqual(
        expectedContext.development.components
      );
      expect(
        cp.fromSelector({
          base: "development.components.database",
          assign: [expectedContext],
        })
      ).toStrictEqual({
        ...expectedContext.development.components.database,
        ...expectedContext,
      });

      expect(
        cp.fromSelector({ base: "development", assign: ["staging"] })
      ).toStrictEqual({
        environment: "staging",
        components: {
          application: {
            replicas: 3,
          },
        },
      });

      expect(
        cp.fromSelector({ base: "development", mergeWith: ["staging"] })
      ).toStrictEqual({
        environment: "staging",
        components: {
          database: {
            size: 5,
          },
          application: {
            replicas: 3,
          },
        },
      });
    });
  });
});
