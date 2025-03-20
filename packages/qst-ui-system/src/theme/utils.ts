import { toRgba, mix, toHex } from 'color2k';
import normalizeStyles from '../styles/css/normalize.css';
import overrideElementPlusStyles from '../styles/css/override_element_plus.css';
import { DayNightModeEnum, ThemeCategory, MixModeEnum, ThemeConfig, ThemeOption } from './types';

/** 传入任何颜色，比如'#ff00ff' 或者'rgba(0, 0, 0, 1)' 等，返回rgb字符串：.eg: '255, 255, 255' */
export const toRgb = (color: string) => {
  const rgba = toRgba(color);
  const rgbaArr = rgba.replace(' ', '').replace('rgba(', '').replace(')', '').split(',');
  return `${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}`;
};

export const mixModeBaseColors = {
  [DayNightModeEnum.light]: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  // light & dark are reversed in dark mode
  [DayNightModeEnum.dark]: {
    light: '#000000',
    dark: '#FFFFFF',
  },
};

export const generateCssVarList = ({
  namespace,
  themeConfig,
  mode,
  generateRgb = true,
  format = false,
  generateColorLevels = true,
}: {
  namespace: string;
  themeConfig: ThemeConfig;
  mode: DayNightModeEnum;
  generateRgb?: boolean;
  format?: boolean;
  generateColorLevels?: boolean;
}) => {
  let styleStr = '';
  let configKey: ThemeCategory;
  const formatStr = format ? '\n' : '';
  for (configKey in themeConfig) {
    const oneConfig = themeConfig[configKey];
    Object.keys(oneConfig).forEach((valKey) => {
      const cssVarName = valKey === 'DEFAULT' ? `${namespace}-${configKey}` : `${namespace}-${configKey}-${valKey}`;
      styleStr += `${cssVarName}: ${oneConfig[valKey as keyof typeof oneConfig]};` + formatStr;
      if (cssVarName.toLowerCase().includes('color') && generateRgb) {
        styleStr += `${cssVarName}-rgb: ${toRgb(oneConfig[valKey as keyof typeof oneConfig])};` + formatStr;
      }
      if (configKey === ThemeCategory.Color && generateColorLevels) {
        // 生成主题色的18层色阶
        Object.keys(MixModeEnum).forEach((mixmode) => {
          for (let i = 1; i < 10; i++) {
            styleStr +=
              `${cssVarName}-${mixmode}-${i}: ${toHex(
                mix(
                  oneConfig[valKey as keyof typeof oneConfig],
                  mixModeBaseColors[mode][mixmode as MixModeEnum],
                  i * 0.1
                )
              )};` + formatStr;
          }
        });
      }
    });
  }

  // 关联冗余的element变量到已赋值的变量
  // --el-color-error = --el-color-danger;
  styleStr = styleStr.concat(`${namespace}-color-error: var(${namespace}-color-danger);`);
  // --el-bg-color-overlay = --el-bg-color;
  styleStr = styleStr.concat(`${namespace}-bg-color-overlay: var(${namespace}-bg-color);`);

  return styleStr;
};

/** 生成初始化样式&组件库(比如element-plus）的全局覆盖样式 */
export const generateResetStyles = (option: ThemeOption) => {
  const { namespace, cssReset, uiLibs } = option;

  const uiLibsList = typeof uiLibs === 'string' ? [uiLibs] : uiLibs;

  let styleStr = `${cssReset ? normalizeStyles : ''}`;
  if (uiLibsList.includes('element-plus')) {
    styleStr += overrideElementPlusStyles;
  } else {
    // TODO 更多UI组件库的定制样式
  }

  const themeNameList = option.themeList.map((theme) => theme.name);

  styleStr = styleStr.replace('.theme-name-placeholder.dark', themeNameList.map((name) => `.${name}.dark`).join(','));
  styleStr = styleStr.replace('.dark .theme-name-placeholde', themeNameList.map((name) => `.dark .${name}`).join(','));
  styleStr = styleStr.replace('.theme-name-placeholder', themeNameList.map((name) => `.${name}`).join(','));

  return styleStr;
};

export const generateBaseStyles = (namespace: string, themeName: string) => {
  return `${themeName} { font-size: var(${namespace}-font-size-base);  ${namespace}-color-white: #ffffff; ${namespace}-color-black: #000000; }`;
};

export const generateThemeStyles = (option: ThemeOption) => {
  let styleStr = '';
  const { namespace, themeList } = option;
  themeList.forEach((theme) => {
    Object.keys(DayNightModeEnum).forEach((mode) => {
      const themeStyleStr = generateCssVarList({
        namespace,
        themeConfig: theme.config[mode as DayNightModeEnum],
        mode: mode as DayNightModeEnum,
      });
      if ((mode as DayNightModeEnum) === DayNightModeEnum.light) {
        styleStr += `.${theme.name} { color-scheme: light; ${themeStyleStr} }`;
      } else {
        styleStr += `.${theme.name}.${mode} { color-scheme: dark; ${themeStyleStr} } .${mode} { .${theme.name} { color-scheme: dark; ${themeStyleStr} } }`;
      }
      styleStr += generateBaseStyles(namespace, theme.name);
    });
  });
  return `${generateResetStyles(option)} ${styleStr}`;
};
