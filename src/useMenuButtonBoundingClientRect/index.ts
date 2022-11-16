export function useMenuButtonBoundingClientRect() {
  const menuButtonBoundingClientRect = uni.getMenuButtonBoundingClientRect();
  return {
    menuButtonBoundingClientRect,
    rect: menuButtonBoundingClientRect,
  };
}
