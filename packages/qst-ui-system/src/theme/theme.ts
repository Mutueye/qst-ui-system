import { mix, toHex } from 'color2k';
import { defaultThemeList } from './defaultThemeList';
import normalizeStyles from '../styles/css/normalize.css';
import overrideElementPlusStyles from '../styles/css/override_element_plus.css';
import { toRgb } from './utils';

// TODO vue QstThemeProvider

// theme css variable categories
export enum ThemeCategory {
  // 主题色
  Color = 'color',
  // 文字色
  TextColor = 'text-color',
  // 背景色
  BgColor = 'bg-color',
  // 边框色
  BorderColor = 'border-color',
  // 填充色
  FillColor = 'fill-color',
  // 自定义附加色
  ExtraColor = 'extra-color',
  // 圆角
  BorderRadius = 'border-radius',
  // 暂不启用box-shadow配置: BoxShadow = 'box-shadow',
  // 间距
  Spacing = 'spacing',
  // 字号
  FontSize = 'font-size',
  // 组件大小
  ComponentSize = 'component-size',
}

// 日间/夜间模式枚举
export enum DayNightModeEnum {
  light = 'light',
  dark = 'dark',
}

// 混合模式枚举，用于根据5种主色生成各主色的10个级别的亮色/暗色
export enum MixModeEnum {
  light = 'light',
  dark = 'dark',
}

export const cssVarCodex = {
  [ThemeCategory.Color]: ['primary', 'success', 'warning', 'danger', 'info'] as const,
  [ThemeCategory.TextColor]: [
    'primary',
    'regular',
    'secondary',
    'placeholder',
    'disabled',
  ] as const,
  [ThemeCategory.BgColor]: ['DEFAULT', 'page', 'secondary'] as const,
  [ThemeCategory.BorderColor]: [
    'exlighter',
    'lighter',
    'light',
    'DEFAULT',
    'dark',
    'darker',
    'exdarker',
  ] as const,
  [ThemeCategory.FillColor]: [
    'blank',
    'reverse',
    'exlighter',
    'lighter',
    'light',
    'DEFAULT',
    'dark',
    'darker',
    'exdarker',
  ] as const,
  // 非element-plus变量，根据项目实际情况自定义添加额外颜色
  [ThemeCategory.ExtraColor]: [] as string[],
  // border radius 在 element-plus 定义的变量之外，新增了'large'和'huge'值
  [ThemeCategory.BorderRadius]: ['small', 'base', 'large', 'huge', 'round', 'circle'] as const,
  // [ThemeCategory.BoxShadow]: ['DEFAULT', 'light', 'lighter', 'dark'],
  // spacing不是element-plus原有变量，例--el-spacing-sm
  [ThemeCategory.Spacing]: [
    'xxxs',
    'xxs',
    'xs',
    'sm',
    'md',
    'DEFAULT',
    'lg',
    'xl',
    'xxl',
    'xxxl',
  ] as const,
  // 在element-plus原有变量之外，新增xxl和xxxl两个字号
  [ThemeCategory.FontSize]: [
    'extra-small',
    'small',
    'base',
    'medium',
    'large',
    'extra-large',
    'xxl',
    'xxxl',
  ] as const,
  [ThemeCategory.ComponentSize]: ['mini', 'small', 'DEFAULT', 'large'] as const,
};

export type ThemeConfig = { [K in ThemeCategory]: Record<(typeof cssVarCodex)[K][number], string> };

export interface UITheme {
  name: string;
  config: {
    [T in DayNightModeEnum]: ThemeConfig;
  };
}

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

/** 组件库计划支持'element-ui', 'element-plus', 'ant-design-vue', 'ant-design', 'vant' */
export type UILib = 'element-ui' | 'element-plus' | 'ant-design-vue' | 'ant-design' | 'vant';

/** 主题选项 */
export interface ThemeOption {
  /** 主题css变量命名空间 默认--el */
  namespace?: string;
  /** 主题列表 */
  themeList?: UITheme[];
  /** 主题样式设置完成后的回调函数 */
  onStylesSet?: () => void;
  /** 是否包含css重置样式(reset/normalize) 默认是 */
  cssReset?: boolean;
  /** 需要适配的组件库(进行样式覆盖/主题定制)  */
  uiLibs?: UILib | UILib[];
  /** 初始主题序号, 默认为主题列表中第一个主题 */
  initialThemeIndex?: number;
  /** 注入<head>内的样式id，默认qst_theme */
  styleTagId?: string;
  /** 开启自动重置样式注入功能：监控<head>中的样式顺序，如果新增样式标签，自动将主题样式重置到最底部，保证主题样式的覆盖作用，默认true */
  autoResetStyleInjection?: boolean;
}

const defaultThemeOption: ThemeOption = {
  namespace: '--el',
  themeList: defaultThemeList,
  cssReset: true,
  uiLibs: 'element-plus',
  styleTagId: 'qst_theme_styles',
  autoResetStyleInjection: true,
};

export const currentThemeList: UITheme[] = [];
export const currentThemeOption: ThemeOption = Object.assign({}, defaultThemeOption);

/**
 * 初始化QstUI
 * @param option {ThemeOption} UI主题选项
 */
export const initQstTheme = (option?: ThemeOption) => {
  // add theme style tag to html header
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
  Object.assign(currentThemeOption, option ? option : {});
  style.setAttribute('id', currentThemeOption.styleTagId);

  // inject theme css var styles to the style tag
  injectThemeStyle();

  // set a theme in theme list as current enabled theme
  setThemeClassByIndex(option && option.initialThemeIndex ? option.initialThemeIndex : 0);

  if (currentThemeOption.autoResetStyleInjection) {
    autoStyleInjection();
  }
};

/**
 * 为保持样式覆盖，重新将注入<head>的样式移动到最后。比如使用动态加载组件功能时，
 * 每次切换页面都会在head内新增部分样式，此时需要重新将主题样式移动到最后，来保证主题样式的覆盖作用
 */
export const resetThemeStyleInjection = () => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const themeEl = document.getElementById(currentThemeOption.styleTagId);
  const lastEl = head.lastElementChild;
  if (lastEl.id !== themeEl.id) {
    head.removeChild(themeEl);
    head.append(themeEl);
  }
};

/** 自动重置样式注入功能：监控<head>中的<style>样式顺序，如果新增样式标签，自动将主题样式重置到最底部，保证主题样式的覆盖作用 */
export const autoStyleInjection = () => {
  const headEl = document.head;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // console.log('A child node has been added or removed.');
        const nodes = mutation.addedNodes;
        let needReinject = false;
        nodes.forEach((node) => {
          const nodeEl = node as HTMLElement;
          // console.log(document.title + 'added node::::', node, node.nodeType, nodeEl.tagName);
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            nodeEl.tagName.toLowerCase() === 'style' &&
            nodeEl.id !== currentThemeOption.styleTagId
          ) {
            // 如果当前新增node为<style>节点，且不是主题样式<style>
            needReinject = true;
          }
        });
        if (needReinject) {
          resetThemeStyleInjection();
        }
      }
    }
  });

  observer.observe(headEl, { childList: true });
};

/**
 * 在header中插入style标签，生成根据传入的option生成的样式
 * @param option {ThemeOption} UI主题选项
 */
export const injectThemeStyle = (option?: ThemeOption) => {
  if (option) {
    Object.assign(currentThemeOption, option);
  }
  // clear theme list
  currentThemeList.length = 0;
  // set current theme list
  currentThemeList.push(...currentThemeOption.themeList);

  const styleEl = document.head.querySelector(`#${currentThemeOption.styleTagId}`) as HTMLElement;
  let styleStr = '';
  const { namespace, themeList } = currentThemeOption;
  themeList.forEach((theme) => {
    Object.keys(DayNightModeEnum).forEach((mode) => {
      const themeStyleStr = generateThemeStyle({
        namespace,
        targetTheme: theme,
        mode: mode as DayNightModeEnum,
      });
      if ((mode as DayNightModeEnum) === DayNightModeEnum.light) {
        styleStr += `.${theme.name} { color-scheme: light; ${themeStyleStr} }`;
      } else {
        styleStr += `.${theme.name}.${mode} { color-scheme: dark; ${themeStyleStr} } .${mode} { .${theme.name} { color-scheme: dark; ${themeStyleStr} } }`;
      }
    });
  });
  styleEl.innerText = `${generateResetStyles(currentThemeOption)} ${styleStr}`;
  if (currentThemeOption && typeof currentThemeOption.onStylesSet === 'function') {
    currentThemeOption.onStylesSet();
  }
};

/**
 * 更新主题色，并重新注入样式
 * @param themeName 主题名称
 * @param mode 模式 light / dark
 * @param color 主题色 Record<"primary" | "success" | "warning" | "danger" | "info", string>
 */
export const updateThemeColor = (
  themeName: string,
  mode: DayNightModeEnum,
  color: Partial<Record<(typeof cssVarCodex)['color'][number], string>>
) => {
  const theme = currentThemeList.find((item) => item.name === themeName);
  if (theme && theme.config[mode]) {
    Object.assign(theme.config[mode].color, color);
  }
  injectThemeStyle();
};

/** 生成初始化样式&组件库(比如element-plus）的全局覆盖样式 */
const generateResetStyles = (option: ThemeOption) => {
  const { namespace, cssReset, uiLibs } = option;

  const uiLibsList = typeof uiLibs === 'string' ? [uiLibs] : uiLibs;

  let styleStr = `${
    cssReset ? normalizeStyles : ''
  } body { font-size: var(${namespace}-font-size-base); }`;
  if (uiLibsList.includes('element-plus')) {
    styleStr += overrideElementPlusStyles;
  } else {
    // TODO 更多UI组件库的定制样式
  }

  styleStr += 'html { --el-color-white: #ffffff; --el-color-black: #000000; }';
  return styleStr.replace('--el-', `${namespace}-`);
};

const generateThemeStyle = ({
  namespace,
  targetTheme,
  mode,
}: {
  namespace: string;
  targetTheme: UITheme;
  mode: DayNightModeEnum;
}) => {
  const config = targetTheme.config[mode];
  let styleStr = '';
  let configKey: ThemeCategory;
  for (configKey in config) {
    const oneConfig = config[configKey];
    Object.keys(oneConfig).forEach((valKey) => {
      const cssVarName =
        valKey === 'DEFAULT' ? `${namespace}-${configKey}` : `${namespace}-${configKey}-${valKey}`;
      styleStr += `${cssVarName}: ${oneConfig[valKey as keyof typeof oneConfig]}; `;
      if (cssVarName.toLowerCase().includes('color')) {
        styleStr += `${cssVarName}-rgb: ${toRgb(oneConfig[valKey as keyof typeof oneConfig])}; `;
      }
      if (configKey === ThemeCategory.Color) {
        Object.keys(MixModeEnum).forEach((mixmode) => {
          for (let i = 1; i < 10; i++) {
            styleStr += `${cssVarName}-${mixmode}-${i}: ${toHex(
              mix(
                oneConfig[valKey as keyof typeof oneConfig],
                mixModeBaseColors[mode][mixmode as MixModeEnum],
                i * 0.1
              )
            )}; `;
          }
        });
      }
    });
  }

  // 关联冗余的element变量到已赋值的变量
  // --el-color-error = --el-color-danger;
  styleStr = styleStr.concat(' ', `${namespace}-color-error: var(${namespace}-color-danger);`);
  // --el-bg-color-overlay = --el-bg-color;
  styleStr = styleStr.concat(' ', `${namespace}-bg-color-overlay: var(${namespace}-bg-color);`);

  return styleStr;
};

/**
 * 根据传入的主题序号切换主题
 * @param themeIndex {number} 主题列表中的序号
 * @returns void
 */
export const setThemeClassByIndex = (themeIndex: number, targetEl?: HTMLElement) => {
  // set theme class name on "html" tag
  if (themeIndex > currentThemeList.length - 1) return;
  const htmlEl = targetEl ? targetEl : document.getElementsByTagName('html')[0];
  const targetThemeName = currentThemeList[themeIndex].name;
  currentThemeList.forEach((theme) => {
    // delete previous theme classes
    if (htmlEl.classList.contains(theme.name) && theme.name !== targetThemeName) {
      htmlEl.classList.remove(theme.name);
    }
  });
  // add target theme class to html tag
  if (!htmlEl.classList.contains(targetThemeName)) {
    htmlEl.classList.add(targetThemeName);
  }
};

/**
 * 根据传入的主题名称切换主题
 * @param themeName {string} 主题名称
 * @returns boolean 设置成功返回true，否则返回false
 */
export const setThemeClassByName = (themeName: string, targetEl?: HTMLElement) => {
  const index = currentThemeList.findIndex((theme) => theme.name === themeName);
  if (index !== -1) {
    setThemeClassByIndex(index, targetEl);
    return true;
  } else {
    return false;
  }
};

/**
 * 给指定的Dom元素切换日/夜模式样式
 * @param {DayNightModeEnum} mode 要切换到的模式
 * @param {HTMLElement} targetEl 目标dom元素，通常不传默认为html元素，即给整个页面切换模式
 */
export const toggleDayNightMode = (mode: DayNightModeEnum, targetEl?: HTMLElement) => {
  // 如果不指定targetEl，则默认在html标签上设置样式class
  const htmlEl = targetEl ? targetEl : document.getElementsByTagName('html')[0];
  if (mode === DayNightModeEnum.dark && !htmlEl.classList.contains(DayNightModeEnum.dark)) {
    htmlEl.classList.add(DayNightModeEnum.dark);
  } else if (mode === DayNightModeEnum.light && htmlEl.classList.contains(DayNightModeEnum.dark)) {
    htmlEl.classList.remove(DayNightModeEnum.dark);
  }
};
