export async function formatContent(content, type) {
  switch (type) {
    case "json": {
      const [
        { default: prettier },
        { default: parserBabel },
        { default: parserEstree },
      ] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);
      return await prettier.format(content, {
        parser: "json",
        plugins: [parserBabel, parserEstree],
      });
    }
    case "graphql": {
      const [{ default: prettier }, { default: parserGraphql }] =
        await Promise.all([
          import("prettier/standalone"),
          import("prettier/plugins/graphql"),
        ]);
      return await prettier.format(content, {
        parser: "graphql",
        plugins: [parserGraphql],
      });
    }
    case "xml": {
      const { default: xmlFormatter } = await import("xml-formatter");
      return xmlFormatter(content, {
        indentation: "  ",
        collapseContent: true,
      });
    }
    default:
      throw new Error("Unknown format type");
  }
}
