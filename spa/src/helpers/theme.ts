type ThemeCSSVariables = Colors | PageBackground | Widget | Borders;

type Colors =
  | "--primary-color"
  | "--button-primary-text-color"
  | "--button-primary-hover-color"
  | "--button-primary-border-color"
  | "--button-secondary-background-color"
  | "--button-secondary-text-color"
  | "--button-secondary-border-color"
  | "--link-color"
  | "--heading-text-color"
  | "--body-text-color"
  | "--positive-color"
  | "--critical-color"
  | "--information-color"
  | "--focus-color"
  | "--hover-color"
  | "--card-background-color"
  | "--card-border-color"
  | "--container-background-color"
  | "--icon-color"
  | "--loader-color"
  | "--input-background-color"
  | "--input-border-color"
  | "--divider-color";

type PageBackground = "--page-background-color" | "--page-background-image";

type Borders =
  | "--button-border-radius"
  | "--button-border-width"
  | "--input-border-radius"
  | "--input-border-width"
  | "--card-border-radius"
  | "--card-border-width"
  | "--container-border-radius";

type Widget = "--text-alignment" | "--content-alignment" | "--container-padding" | "--logo-height";

export function getThemeValue(cssVar: ThemeCSSVariables) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar);
}
