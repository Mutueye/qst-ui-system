import { toRgba } from 'color2k';

/** 传入任何颜色，比如'#ff00ff' 或者'rgba(0, 0, 0, 1)' 等，返回rgb字符串：.eg: '255, 255, 255' */
export const toRgb = (color: string) => {
  const rgba = toRgba(color);
  const rgbaArr = rgba.replace(' ', '').replace('rgba(', '').replace(')', '').split(',');
  return `${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}`;
};
