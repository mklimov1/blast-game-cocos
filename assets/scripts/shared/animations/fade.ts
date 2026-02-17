import { Node, UIOpacity, tween, v3 } from 'cc';

export const fadeOut = (node: Node, duration: number = 0.2): Promise<void> => {
  let opacity = node.getComponent(UIOpacity);
  if (!opacity) opacity = node.addComponent(UIOpacity);

  return new Promise<void>((resolve) => {
    tween(opacity)
      .to(duration, { opacity: 0 })
      .call(() => resolve())
      .start();
  });
};

export const fadeIn = (node: Node, duration: number = 0.1): Promise<void> => {
  let opacity = node.getComponent(UIOpacity);
  if (!opacity) opacity = node.addComponent(UIOpacity);

  const toScale = node.scale.x;
  opacity.opacity = 0;
  node.setScale(v3(0.3, 0.3, 1));

  return new Promise<void>((resolve) => {
    tween(opacity).to(duration, { opacity: 255 }, { easing: 'backOut' }).start();

    tween(node)
      .to(duration, { scale: v3(toScale, toScale, 1) }, { easing: 'backOut' })
      .call(() => resolve())
      .start();
  });
};
