import { Container, createTheme, CSSVariablesResolver } from "@mantine/core";

export const themeOverride = createTheme({
  defaultRadius: `10px`,
  // fontFamily: "Andika, sans-serif",
  // fontFamilyMonospace: "Andika, sans-serif",
  // headings: {
  //   fontFamily: "Bevan, sans-serif",
  //   fontWeight: "400",
  // },
  // other: {
  //   color_1: "#00FFF0",
  //   color_2: "#00D1FF",
  //   color_3: "#061022",
  // },
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => {
        return {
          root: {
            "--container-size": fluid ? `100%` : `var(--container-size-${size ? size : `md`})`,
          },
        };
      },
    }),
  },
});

export const resolver: CSSVariablesResolver = () => ({
  variables: {
    // "--mantine-color-1": theme.other.color_1,
  },
  light: {},
  dark: {},
});
