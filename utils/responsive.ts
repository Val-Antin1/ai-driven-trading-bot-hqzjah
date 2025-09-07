
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Get responsive dimensions
export const getResponsiveDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Scale function for responsive sizing
export const scale = (size: number): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scaleRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Vertical scale for heights
export const verticalScale = (size: number): number => {
  const scaleRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  const newSize = size * scaleRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Moderate scale for fonts
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Responsive width percentage
export const widthPercentageToDP = (widthPercent: number): number => {
  const elemWidth = parseFloat(widthPercent.toString());
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

// Responsive height percentage
export const heightPercentageToDP = (heightPercent: number): number => {
  const elemHeight = parseFloat(heightPercent.toString());
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

// Device type detection
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 375;
};

export const isLargeDevice = (): boolean => {
  return SCREEN_WIDTH > 414;
};

// Responsive padding and margins
export const getResponsivePadding = () => {
  if (isTablet()) {
    return {
      xs: scale(4),
      sm: scale(8),
      md: scale(16),
      lg: scale(24),
      xl: scale(32),
    };
  } else if (isSmallDevice()) {
    return {
      xs: scale(2),
      sm: scale(6),
      md: scale(12),
      lg: scale(18),
      xl: scale(24),
    };
  } else {
    return {
      xs: scale(4),
      sm: scale(8),
      md: scale(16),
      lg: scale(24),
      xl: scale(32),
    };
  }
};

// Responsive font sizes
export const getResponsiveFontSizes = () => {
  return {
    xs: moderateScale(10),
    sm: moderateScale(12),
    md: moderateScale(14),
    lg: moderateScale(16),
    xl: moderateScale(18),
    xxl: moderateScale(20),
    xxxl: moderateScale(24),
    title: moderateScale(28),
    header: moderateScale(32),
  };
};

// Chart dimensions
export const getChartDimensions = () => {
  const padding = getResponsivePadding();
  const chartWidth = SCREEN_WIDTH - (padding.md * 2);
  const chartHeight = isTablet() ? verticalScale(250) : verticalScale(200);
  
  return {
    width: chartWidth,
    height: chartHeight,
  };
};

// Grid calculations
export const getGridColumns = (itemWidth: number, spacing: number = 16): number => {
  const availableWidth = SCREEN_WIDTH - (spacing * 2);
  const itemsPerRow = Math.floor(availableWidth / (itemWidth + spacing));
  return Math.max(1, itemsPerRow);
};

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
