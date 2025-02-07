
class ScreenInterleavePrompt {
    opacity: {
        normal: number,
        screen: number,
        multiply: number,
        soft_light: number 
    };
    constructor(
    normal_opacity: number = 0,
    screen_opacity: number = 0,
    multiply_opacity: number = 0,
    soft_light_opacity: number = 0
    )
    {
      this.opacity = {
        normal: normal_opacity,
        screen: screen_opacity,
        multiply: multiply_opacity,
        soft_light: soft_light_opacity 
      };
    }
  }
  
  export { ScreenInterleavePrompt };
  