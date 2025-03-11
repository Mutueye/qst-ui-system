import { defaultThemeList } from './defaultThemeList';
import { generateThemeStyles } from './utils';
import { DayNightModeEnum, ThemeOption, cssVarCodex, UITheme } from './types';

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
 * 初始化QstUI：初始化样式，注入样式，设置默认主题
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

/**
 * 自动重置样式注入功能：监控<head>中的<style>样式顺序，如果新增样式标签，自动将主题样式重置到最底部，保证主题样式的覆盖作用
 */
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
  styleEl.innerText = generateThemeStyles(currentThemeOption);
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
  currentThemeOption.currentThemeIndex = themeIndex;
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
