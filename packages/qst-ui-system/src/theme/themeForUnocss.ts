import { cssVarCodex } from './theme';

// css变量配置项类型
export type CssVarConfigType = Record<string, (string | CssVarConfigType)[]>;
export interface ConfigList {
  [key: string]: ConfigList | string;
}

/** 主题变量配置的数组转换为unocss可用的数组: 例：颜色变量'extra-light'需要转换为{ extra: ['light'] } */
const transformDashedVariables = (arr: string[]) => {
  const objectKeysArrayObj: CssVarConfigType = {};
  const result: (string | CssVarConfigType)[] = [];
  arr.forEach((str) => {
    const dashArray = str.split('-');
    if (dashArray.length > 1) {
      const key = dashArray.shift();
      const val = transformDashedVariables(dashArray);
      if (objectKeysArrayObj[key]) {
        objectKeysArrayObj[key].push(...val);
      } else {
        objectKeysArrayObj[key] = val;
        result.push({ [key]: objectKeysArrayObj[key] });
      }
    } else {
      result.push(str);
    }
  });
  return result;
};

/** Get css var config from cssVarCodex */
const getConfigFromCodex = () => {
  const config: CssVarConfigType = {};
  for (const key in cssVarCodex) {
    if (key.includes('color')) {
      config[key] = transformDashedVariables(cssVarCodex[key]);
    } else {
      config[key] = cssVarCodex[key];
    }
  }
  return config;
};

// 主题配置css变量对照表
// {
//   color: ['primary', 'success', 'warning', 'danger', 'error', 'info'],
//   'text-color': ['primary', 'regular', 'secondary', 'placeholder', 'disabled'],
//   'bg-color': ['DEFAULT', 'overlay', 'page', 'secondary'],
//   'border-color': ['DEFAULT', 'light', 'lighter', { extra: ['light'] }, 'dark', 'darker'],
//   'fill-color': ['DEFAULT', 'light', 'lighter', { extra: ['light'] }, 'dark', 'darker', 'blank'],
//   'border-radius': ['base', 'small', 'round', 'circle'],
//   // 'box-shadow': ['DEFAULT', 'light', 'lighter', 'dark'],
//   space: ['xxxs', 'xxs', 'xs', 'sm', 'md', 'DEFAULT', 'lg', 'xl', 'xxl', 'xxxl'],
//   'font-size': ['extra-small', 'small', 'base', 'medium', 'large', 'extra-large'],
//   'component-size': ['small', 'DEFAULT', 'large'],
// };
/** css变量配置表，例上述注释这样 */
const cssVarConfig: CssVarConfigType = getConfigFromCodex();

// 生成主题色变量配置表
const generateMainColors = (namespace: string) => {
  const colors: Record<string, unknown> = {};
  cssVarConfig.color.forEach((colorType) => {
    colors[colorType as string] = { DEFAULT: `var(${namespace}-color-${colorType})` };
    const mixModes = ['light', 'dark'];
    mixModes.forEach((mixMode) => {
      const subColors: Record<number, string> = {};
      for (let i = 1; i < 10; i++) {
        subColors[i] = `var(${namespace}-color-${colorType}-${mixMode}-${i})`;
      }
      colors[colorType as string][mixMode] = subColors;
    });
  });
  return colors;
};

// 根据类型生成对应的css变量配置列表
const generateCssVarFromConfig = ({
  key,
  namespace,
  keyPrepend = '',
  generateNegative = false,
}: {
  /** 变量配置表对应的索引key，比如 color / text-color / spacing 等 */
  key: string;
  /** css变量命名空间，默认'--el' */
  namespace: string;
  /** 可选，给unocss主题配置项的key附加前缀，比如width配置中，增加'spacing前缀'，生成 { ..., 'spacing-xl': '--el-spacing-xl', ...} */
  keyPrepend?: string;
  /** 是否生成负值变量 */
  generateNegative?: boolean;
}) => {
  const list: ConfigList = {};
  const targetConfigSource = cssVarConfig[key];
  if (targetConfigSource) {
    targetConfigSource.forEach((type) => {
      if (typeof type === 'string') {
        let configKey = keyPrepend ? keyPrepend + '-' + type : type;
        let cssVarStr = `var(${namespace}-${key}-${type})`;
        if (type === 'DEFAULT') {
          configKey = keyPrepend ? keyPrepend : type;
          cssVarStr = `var(${namespace}-${key})`;
        }
        list[configKey] = cssVarStr;
        if (generateNegative) list[`${configKey}-negative`] = `calc(-1 * ${cssVarStr})`;
      } else {
        const subKey = Object.keys(type as CssVarConfigType)[0];
        list[keyPrepend ? keyPrepend + '-' + subKey : subKey] = generateCssVarFromConfig({
          key: subKey,
          namespace: `${namespace}-${key}`,
          generateNegative,
        });
      }
    });
  }

  return list;
};

const getDefaultSizes = (namespace: string) => {
  return {
    ...generateCssVarFromConfig({
      key: 'spacing',
      namespace,
      keyPrepend: 'spacing',
      generateNegative: true,
    }),
    ...generateCssVarFromConfig({
      key: 'component-size',
      namespace,
      keyPrepend: 'component-size',
      generateNegative: true,
    }),
    // header: '72px',
    // 'left-menu': '300px',
  };
};

export const generateExtraColors = (option: {
  namespace?: string;
  configkey?: string;
  configs: Record<string, string>;
}) => {
  const { namespace = '--el', configkey = 'extra-color', configs } = option;
  // TODO
  const result: Record<keyof typeof configs, string> = {};
  Object.keys(configs).forEach((key) => {
    result[key] = `var(${namespace}-${configkey}-${configs[key]})`;
  });
  return result;
};

// theme配置示例。默认theme配置详见unocss源码：
// https://github.com/unocss/unocss/tree/main/packages/preset-mini/src/_theme
export const generateUnocssTheme = (
  namespace = '--el',
  extraColorConfig?: Record<string, string>
) => {
  const defaultSizes = getDefaultSizes(namespace) as Record<string, string>;
  return {
    width: defaultSizes,
    height: defaultSizes,
    maxWidth: defaultSizes,
    maxHeight: defaultSizes,
    minWidth: defaultSizes,
    minHeight: defaultSizes,
    inlineSize: defaultSizes,
    blockSize: defaultSizes,
    maxInlineSize: defaultSizes,
    maxBlockSize: defaultSizes,
    minInlineSize: defaultSizes,
    minBlockSize: defaultSizes,
    lineHeight: defaultSizes,
    spacing: defaultSizes,

    // boxShadow: {
    //   // 示例
    //   none: 'none',
    //   sm: '0 1px 2px 0 rgb(0 0 0 / 5%)',
    //   DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 5%), 0 1px 2px 0 rgb(0 0 0 / 2%)',
    //   md: '0 4px 6px -1px rgb(0 0 0 / 7%), 0 2px 4px -1px rgb(0 0 0 / 6%)',
    //   lg: '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%)',
    //   xl: '0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%)',
    //   ...generateCssVarFromConfig(cssVarConfig, 'box-shadow', namespace),
    // },

    // 如果自定义breakpoints，会覆盖默认配置，而不是像其他一样合并默认配置
    // 断点由各自的项目根据需求来配置
    // breakpoints: {
    //   sm: '640px',
    //   md: '768px',
    //   lg: '1024px',
    //   xl: '1280px',
    //   xxl: '1536px',
    // },
    borderRadius: {
      // none: '0',
      // xs: '2px',
      // sm: '4px',
      // md: '6px',
      // lg: '8px',
      // xl: '10px',
      // xxl: '12px',
      // full: '9999px',
      ...(generateCssVarFromConfig({ key: 'border-radius', namespace }) as Record<string, string>),
    },
    colors: {
      theme: `var(${namespace}-color-primary)`,
      ...generateMainColors(namespace),
      text: generateCssVarFromConfig({ key: 'text-color', namespace }),
      bg: generateCssVarFromConfig({ key: 'bg-color', namespace }),
      border: generateCssVarFromConfig({ key: 'border-color', namespace }),
      fill: generateCssVarFromConfig({ key: 'fill-color', namespace }),
      extra: extraColorConfig ? generateExtraColors({ configs: extraColorConfig, namespace }) : {},
    },
    // fontFamily: {
    //   main: 'PingFang SC, Microsoft YaHei, Hiragino Sans GB, SimSun, sans-serif',
    // },
    fontSize: {
      ...(generateCssVarFromConfig({ key: 'font-size', namespace }) as Record<string, string>),
    },
  };
};
