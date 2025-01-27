import { toRgba, mix, toHex } from 'color2k';
import { DayNightModeEnum, ThemeCategory, MixModeEnum, ThemeConfig } from './types';

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
  styleStr = styleStr.concat(`${namespace}-color-error: var(${namespace}-color-danger);\n`);
  // --el-bg-color-overlay = --el-bg-color;
  styleStr = styleStr.concat(`${namespace}-bg-color-overlay: var(${namespace}-bg-color);\n`);

  return styleStr;
};
