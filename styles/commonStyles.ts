
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { 
  scale, 
  moderateScale, 
  getResponsivePadding, 
  getResponsiveFontSizes,
  isTablet,
  SCREEN_WIDTH 
} from '../utils/responsive';

const padding = getResponsivePadding();
const fonts = getResponsiveFontSizes();

export const colors = {
  primary: '#162456',    // Material Blue
  secondary: '#193cb8',  // Darker Blue
  accent: '#64B5F6',     // Light Blue
  background: '#101824',  // Keeping dark background
  backgroundAlt: '#162133',  // Keeping dark background
  text: '#e3e3e3',       // Keeping light text
  grey: '#90CAF9',       // Light Blue Grey
  card: '#193cb8',       // Keeping dark card background
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: padding.md,
    paddingHorizontal: padding.lg,
    borderRadius: scale(8),
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: padding.md,
    paddingHorizontal: padding.lg,
    borderRadius: scale(8),
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: isTablet() ? 1024 : SCREEN_WIDTH,
    width: '100%',
    paddingHorizontal: padding.md,
  },
  title: {
    fontSize: fonts.title,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: padding.sm,
  },
  text: {
    fontSize: fonts.lg,
    fontWeight: '500',
    color: colors.text,
    marginBottom: padding.xs,
    lineHeight: fonts.lg * 1.5,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: padding.md,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: padding.md,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: scale(12),
    padding: padding.md,
    marginVertical: padding.xs,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: scale(60),
    height: scale(60),
    tintColor: "white",
  },
  // Responsive grid layouts
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: padding.md,
  },
  gridItem2: {
    width: isTablet() ? '48%' : '48%',
    marginBottom: padding.md,
  },
  gridItem3: {
    width: isTablet() ? '31%' : '100%',
    marginBottom: padding.md,
  },
  gridItem4: {
    width: isTablet() ? '23%' : '48%',
    marginBottom: padding.md,
  },
  // Responsive text styles
  textXS: {
    fontSize: fonts.xs,
    color: colors.text,
  },
  textSM: {
    fontSize: fonts.sm,
    color: colors.text,
  },
  textMD: {
    fontSize: fonts.md,
    color: colors.text,
  },
  textLG: {
    fontSize: fonts.lg,
    color: colors.text,
  },
  textXL: {
    fontSize: fonts.xl,
    color: colors.text,
  },
  textXXL: {
    fontSize: fonts.xxl,
    color: colors.text,
  },
  // Responsive spacing
  marginXS: { margin: padding.xs },
  marginSM: { margin: padding.sm },
  marginMD: { margin: padding.md },
  marginLG: { margin: padding.lg },
  paddingXS: { padding: padding.xs },
  paddingSM: { padding: padding.sm },
  paddingMD: { padding: padding.md },
  paddingLG: { padding: padding.lg },
});

// Export responsive values for direct use
export const responsiveValues = {
  padding,
  fonts,
  scale,
  moderateScale,
};
